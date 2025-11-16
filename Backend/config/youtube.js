import {google} from "googleapis";
import dotenv from "dotenv";
dotenv.config();


const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL,
    GOOGLE_REFRESH_TOKEN

} = process.env;


const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL
    

);
oauth2Client.setCredentials({
    refresh_token : GOOGLE_REFRESH_TOKEN
});

export const youtube = google.youtube({
   version : "v3",
   auth :oauth2Client
})