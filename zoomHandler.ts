// src/zoomHandler.ts
import { Router, Request, Response } from 'express';
import axios from 'axios';
import Attendance from './models/Attendance'; // Ensure this path is correct and Mongoose is connected
import qs from 'qs';
import dotenv from 'dotenv';
import crypto from 'crypto'; // Import the crypto module for HMAC hashing

dotenv.config();

const router = Router();

// Load environment variables for Zoom API credentials and Webhook Secret Token
// Ensure these are set in your Vercel project's environment variables.
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID || 'YOUR_ZOOM_ACCOUNT_ID';
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID || 'YOUR_CLIENT_ID';
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET || 'YOUR_SECRET';
const ZOOM_WEBHOOK_SECRET_TOKEN = process.env.ZOOM_WEBHOOK_SECRET_TOKEN || 'YOUR_WEBHOOK_SECRET_TOKEN'; // This is crucial for webhook validation

/**
 * Asynchronously obtains an access token from the Zoom OAuth API.
 * This token is used to authorize subsequent API calls to Zoom.
 * It uses the 'account_credentials' grant type for Server-to-Server OAuth apps.
 * @returns {Promise<string>} A promise that resolves with the access token string.
 * @throws {Error} If the access token request fails.
 */
async function getAccessToken(): Promise<string> {
  try {
    // Prepare the data for the POST request, URL-encoded
    const data = qs.stringify({
      grant_type: 'account_credentials', // Required grant type for Server-to-Server OAuth
      account_id: ZOOM_ACCOUNT_ID, // Your Zoom Account ID
    });

    // Make a POST request to Zoom's OAuth token endpoint
    const res = await axios.post(
      'https://zoom.us/oauth/token',
      data,
      {
        headers: {
          // Authorization header using Basic authentication with base64 encoded Client ID and Secret
          Authorization:
            'Basic ' +
            Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded', // Specify content type for the request body
        },
      }
    );

    // Return the access token from the response
    return res.data.access_token;
  } catch (error) {
    console.error('Failed to get access token:', (error as Error).message);
    throw error; // Re-throw the error for upstream handling
  }
}

/**
 * Handles incoming POST requests to the /webhook endpoint.
 * This function processes Zoom webhook notifications, including URL validation
 * and 'meeting.ended' events to fetch and save participant attendance.
 */
router.post('/webhook', async (req: Request, res: Response) => {
  // Zoom webhook validation (Challenge-Response Check - CRC)
  // Zoom sends a POST request with 'event: endpoint.url_validation' and 'payload.plainToken'.
  // Your server must respond with a 200 OK, set the 'x-zm-signature' header,
  // and return a JSON object containing the 'plainToken'.
  if (req.body && req.body.event === 'endpoint.url_validation' && req.body.payload && req.body.payload.plainToken) {
    const plainToken = req.body.payload.plainToken;

    // Calculate the HMAC SHA256 hash using the webhook secret token.
    // This hash is required for Zoom to verify your endpoint's authenticity.
    const hash = crypto
      .createHmac('sha256', ZOOM_WEBHOOK_SECRET_TOKEN)
      .update(plainToken)
      .digest('base64');

    console.log('Zoom URL validation request received.');
    console.log('Plain Token:', plainToken);
    console.log('Calculated Hash for validation:', hash);

    // Set the 'x-zm-signature' header. The format is 'v0=' followed by the base64 encoded hash.
    res.setHeader('x-zm-signature', `v0=${hash}`);

    // Respond with a 200 OK status and a JSON object containing the plainToken.
    // This fulfills Zoom's requirement for the challenge-response check.
      res.status(200).json({
      plainToken: plainToken,
      encryptedToken: hash,
    });
        return ;
  }

  // Process other actual Zoom event notifications
  const { event, payload } = req.body;

  // Handle 'meeting.ended' event
  if (event === 'meeting.ended') {
    const meetingUUID = payload.object.uuid; // Extract the meeting UUID from the payload

    try {
      const token = await getAccessToken(); // Get a fresh access token for API calls
      // Fetch meeting participants using the Zoom API
      const participantsRes = await axios.get(
        `https://api.zoom.us/v2/report/meetings/${encodeURIComponent(meetingUUID)}/participants`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the obtained access token
          },
        }
      );

      const participants = participantsRes.data.participants; // Extract participants data

      // Save each participant's attendance record to MongoDB.
      // This assumes your Mongoose connection is established and the Attendance model is defined.
      await Promise.all(
        participants.map((p: any) =>
          Attendance.create({
            meetingId: meetingUUID,
            name: p.name,
            email: p.user_email,
            join_time: p.join_time,
            leave_time: p.leave_time,
            duration: p.duration,
            timestamp: new Date(), // Record the current timestamp
          })
        )
      );

      // Send a success response back to Zoom
      res.status(200).send('Attendance saved');
    } catch (err: any) {
      // Log and send an error response if fetching participants or saving attendance fails
      console.error('Error fetching participants or saving attendance:', err.message);
      res.status(500).send('Error processing meeting.ended event');
    }
  } else {
    // For any other events not explicitly handled, send a 200 OK to acknowledge
    // and prevent Zoom from retrying the notification.
    res.status(200).send('Ignored');
  }
});

export default router;
