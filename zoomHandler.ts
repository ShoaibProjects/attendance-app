// src/zoomHandler.ts
import { Router, Request, Response } from 'express';
import axios from 'axios';
import Attendance from './models/Attendance';
import qs from 'qs'; 
import dotenv from 'dotenv';


dotenv.config(); 

const router = Router();

// Load from env variables or config
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID || 'YOUR_ZOOM_ACCOUNT_ID';
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID || 'YOUR_CLIENT_ID';
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET || 'YOUR_SECRET';


async function getAccessToken(): Promise<string> {
  try {
    const data = qs.stringify({
      grant_type: 'account_credentials',
      account_id: ZOOM_ACCOUNT_ID,
    });

    const res = await axios.post(
      'https://zoom.us/oauth/token',
      data,
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return res.data.access_token;
  } catch (error) {
    console.error('Failed to get access token:', (error as Error).message);
    throw error;
  }
}



router.post('/webhook', async (req: Request, res: Response) => {
  const { event, payload } = req.body;


if (event === 'meeting.ended') {
    const meetingUUID = payload.object.uuid;

    try {
      const token = await getAccessToken();
      const participantsRes = await axios.get(
        `https://api.zoom.us/v2/report/meetings/${encodeURIComponent(meetingUUID)}/participants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const participants = participantsRes.data.participants;

      // Save each participant attendance to MongoDB
      await Promise.all(
        participants.map((p: any) =>
          Attendance.create({
            meetingId: meetingUUID,
            name: p.name,
            email: p.user_email,
            join_time: p.join_time,
            leave_time: p.leave_time,
            duration: p.duration,
            timestamp: new Date(),
          })
        )
      );

      res.status(200).send('Attendance saved');
    } catch (err: any) {
      console.error('Error fetching participants:', err.message);
      res.status(500).send('Error');
    }
  } else {
    res.status(200).send('Ignored');
  }
});

export default router;
