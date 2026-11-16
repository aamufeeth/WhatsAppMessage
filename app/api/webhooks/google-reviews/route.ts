import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import sql from '@/lib/db';

// Helper: Dispatch WhatsApp template messages via Meta Graph API
async function sendDirectWhatsAppAlerts(recipients:any, branchLabel:string, reviewerName:string, ratingValue:string, reviewText:string) {
  const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;
  const ACCESS_TOKEN = process.env.META_PERMANENT_TOKEN;
  const TEMPLATE_NAME = 'low_rating_alert'; // Must match your approved Meta template
  const LANGUAGE_CODE = 'en';

  const metaApiUrl = `https://facebook.com{PHONE_NUMBER_ID}/messages`;

  for (const recipientPhone of recipients) {
    const payload = {
      messaging_product: 'whatsapp',
      to: recipientPhone,
      type: 'template',
      template: {
        name: TEMPLATE_NAME,
        language: { code: LANGUAGE_CODE },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: `${branchLabel} - ${reviewerName}` }, // Maps to {{1}}
              { type: 'text', text: ratingValue },                        // Maps to {{2}}
              { type: 'text', text: reviewText },                         // Maps to {{3}}
            ],
          },
        ],
      },
    };

    try {
      const response = await fetch(metaApiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(`Meta API error for ${recipientPhone}:`, data);
      } else {
        console.log(`Alert sent to ${recipientPhone}. Message ID:`, data.messages?.[0]?.id);
      }
    } catch (error:any) {
      console.error(`Network error sending to ${recipientPhone}:`, error.message);
    }
  }
}

// POST Handler triggered by Google Cloud Pub/Sub
export async function POST(request:any) {
  try {
    const body = await request.json();

    // 1. Decode Base64 Pub/Sub message
    const pubsubMessage = body?.message;
    if (!pubsubMessage || !pubsubMessage.data) {
      return NextResponse.json({ message: 'No Pub/Sub data found' }, { status: 200 });
    }

    const decodedString = Buffer.from(pubsubMessage.data, 'base64').toString('utf-8');
    const notificationData = JSON.parse(decodedString);

    // Format: "accounts/123/locations/456/reviews/789"
    const reviewResourceName = notificationData.reviewName;
    if (!reviewResourceName) {
      return NextResponse.json({ message: 'No reviewName in payload' }, { status: 200 });
    }

    // Extract "accounts/123/locations/456"
    const locationPath = reviewResourceName.split('/reviews/')[0];

    // 2. Join `client_branches` and `clients` to get branch details and parent refresh_token
    const branchRows = await sql`
      SELECT 
        b.id AS branch_id,
        b.branch_name,
        c.business_name,
        c.refresh_token
      FROM client_branches b
      JOIN clients c ON b.client_id = c.id
      WHERE b.google_location_id = ${locationPath}
        AND b.is_active = TRUE
        AND c.is_active = TRUE
      LIMIT 1
    `;

    if (!branchRows || branchRows.length === 0) {
      return NextResponse.json({ message: 'Branch not found or inactive' }, { status: 200 });
    }

    const branch = branchRows[0];

    // 3. Authenticate silently using parent client's refresh_token
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ refresh_token: branch.refresh_token });

    const { token: freshAccessToken } = await oauth2Client.getAccessToken();

    // 4. Fetch full review details from Google API
    const reviewUrl = `https://googleapis.com{reviewResourceName}`;
    const reviewResponse = await fetch(reviewUrl, {
      headers: { Authorization: `Bearer ${freshAccessToken}` },
    });

    if (!reviewResponse.ok) {
      throw new Error(`Failed to fetch review from Google: ${reviewResponse.statusText}`);
    }

    const review = await reviewResponse.json();

    // 5. Filter: Only proceed if starRating is ONE
    if (review.starRating !== 'ONE') {
      return NextResponse.json({ message: 'Skipped non-1-star review' }, { status: 200 });
    }

    // 6. Query `alert_recipients` using `branch_id`
    const recipientRows = await sql`
      SELECT phone_number 
      FROM alert_recipients 
      WHERE branch_id = ${branch.branch_id} 
        AND is_enabled = TRUE
    `;

    if (!recipientRows || recipientRows.length === 0) {
      return NextResponse.json({ message: 'No active WhatsApp recipients for this branch' }, { status: 200 });
    }

    const phoneList = recipientRows.map((r) => r.phone_number);
    const branchLabel = `${branch.business_name} (${branch.branch_name})`;

    // 7. Dispatch WhatsApp alerts directly via Meta Cloud API
    await sendDirectWhatsAppAlerts(
      phoneList,
      branchLabel,
      review.reviewer?.displayName || 'Anonymous Customer',
      '1',
      review.comment || 'No written comment provided.'
    );

    return NextResponse.json({ status: 'Success', message: '1-Star alerts dispatched' }, { status: 200 });

  } catch (error) {
    console.error('Next.js Webhook Processing Error:', error);
    return NextResponse.json({ error: 'Internal processing error' }, { status: 200 });
  }
}
