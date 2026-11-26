import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI // e.g., https://yourdomain.com
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Requests permanent refresh_token
    prompt: 'consent',      // Forces consent screen so refresh_token is always returned
    scope: ['https://www.googleapis.com']
  });

  return NextResponse.redirect(authUrl);
}
