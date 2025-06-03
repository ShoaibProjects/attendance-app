// src/routes/attendanceRoutes.ts
import express, { RequestHandler } from 'express';
import { getAttendanceByDate, getAttendanceByName, getAttendanceByNameAndDate } from '../controllers/attendanceController';

const router = express.Router();

router.get('/by-date', getAttendanceByDate);     // ?date=2025-06-01
router.get('/by-name/:name', getAttendanceByName);
router.get('/by-name-and-date', getAttendanceByNameAndDate as RequestHandler);

export default router;
