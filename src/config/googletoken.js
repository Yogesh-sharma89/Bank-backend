 import { google } from "googleapis";
 import "dotenv/config";
 const Oauth2 = google.auth.OAuth2;

const oauth2Client = new Oauth2({
    clientId:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    redirectUri:"https://developers.google.com/oauthplayground"
})

oauth2Client.setCredentials({
    refresh_token:process.env.REFRESH_TOKEN
})

export const accessToken = await oauth2Client.getAccessToken();

