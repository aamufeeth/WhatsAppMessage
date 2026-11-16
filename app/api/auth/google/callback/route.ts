import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import sql from '@/lib/db'; // Your Postgres.js / Neon / Supabase SQL client

export async function GET(request:any) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code missing from Google.' }, { status: 400 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // 1. Exchange temporary code for permanent tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    if (!tokens.refresh_token) {
      return NextResponse.json(
        { error: 'No refresh_token returned. Revoke app access in your Google Account settings and try again.' },
        { status: 400 }
      );
    }

    const mybusinessAccount = google.mybusinessaccountmanagement({
      version: 'v1',
      auth: oauth2Client,
    });

    const mybusinessInfo = google.mybusinessbusinessinformation({
      version: 'v1',
      auth: oauth2Client,
    });

    // 2. Fetch all Google Business Profile Accounts managed by your email
    const accountsRes = await mybusinessAccount.accounts.list();
    const accounts = accountsRes.data.accounts || [];

    if (accounts.length === 0) {
      return NextResponse.json({ error: 'No Google Business Profile accounts found.' }, { status: 404 });
    }

    const syncedSummary = [];

    // 3. Loop through each managed client account
    for (const account of accounts) {
      const googleAccountId = account.name || 'Unnamed'; // Format: "accounts/123456789"
      const businessName = account.accountName || 'Unnamed Business';

      // Upsert parent record into `clients`
      const [savedClient] = await sql`
        INSERT INTO clients (business_name, google_account_id, refresh_token, is_active)
        VALUES (${businessName}, ${googleAccountId}, ${tokens.refresh_token}, TRUE)
        ON CONFLICT (google_account_id) 
        DO UPDATE SET 
          refresh_token = EXCLUDED.refresh_token,
          business_name = EXCLUDED.business_name
        RETURNING id
      `;

      const clientId = savedClient.id;

      // 4. Subscribe the account to Google Cloud Pub/Sub
      const notificationUrl = `https://googleapis.com{googleAccountId}/notificationSetting?updateMask=pubsubTopic,notificationTypes`;
      
      await fetch(notificationUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${googleAccountId}/notificationSetting`,
          pubsubTopic: process.env.PUBSUB_TOPIC_NAME,
          notificationTypes: ['NEW_REVIEW'],
        }),
      });

      // 5. Fetch all locations/branches under this client account
      const locationsRes = await mybusinessInfo.accounts.locations.list({
        parent: googleAccountId,
        readMask: 'name,title',
      });

      const locations = locationsRes.data.locations || [];
      const savedBranches = [];

      // 6. Upsert each branch into `client_branches`
      for (const loc of locations) {
        const fullLocationId = `${googleAccountId}/${loc.name}`; // e.g., "accounts/123/locations/456"
        const branchName = loc.title || 'Main Branch';

        await sql`
          INSERT INTO client_branches (
            client_id, 
            google_account_id, 
            branch_name, 
            google_location_id, 
            is_active
          )
          VALUES (
            ${clientId}, 
            ${googleAccountId}, 
            ${branchName}, 
            ${fullLocationId}, 
            TRUE
          )
          ON CONFLICT (google_location_id) 
          DO UPDATE SET 
            branch_name = EXCLUDED.branch_name,
            google_account_id = EXCLUDED.google_account_id
        `;

        savedBranches.push({ branchName, fullLocationId });
      }

      syncedSummary.push({
        businessName,
        googleAccountId,
        branchesSynced: savedBranches.length,
        branches: savedBranches,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'All client accounts and branches synced successfully.',
      syncedSummary,
    });

  } catch (error:any) {
    console.error('OAuth Sync Error:', error);
    return NextResponse.json(
      { error: 'Failed to sync Google Business Profile.', details: error.message },
      { status: 500 }
    );
  }
}
