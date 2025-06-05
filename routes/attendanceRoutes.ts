import express, { RequestHandler } from 'express';
import {
  getAttendanceByDate,
  getAttendanceByName,
  getAttendanceByNameAndDate,
  getAttendanceByNameUntilDate, // 👈 Import the new controller
} from '../controllers/attendanceController';

const router = express.Router();

router.get('/by-date', getAttendanceByDate);                         // ?date=2025-06-01
router.get('/by-name/:name', getAttendanceByName);                   // /by-name/John
router.get('/by-name-and-date', getAttendanceByNameAndDate as RequestHandler); // ?name=John&date=2025-06-01
router.get('/by-name-until-date', getAttendanceByNameUntilDate as RequestHandler); // ✅ NEW: ?name=John&date=2025-06-01

export default router;
