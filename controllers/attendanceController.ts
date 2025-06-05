// src/controllers/attendanceController.ts
import Attendance from '../models/Attendance';
import { Request, Response } from 'express';

export const getAttendanceByDate = async (req: Request, res: Response) => {
  const { date } = req.query;
  try {
    const start = new Date(date as string);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const records = await Attendance.find({
      timestamp: { $gte: start, $lt: end }
    });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance' });
  }
};

export const getAttendanceByName = async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    const records = await Attendance.find({ name: new RegExp(name, 'i') });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance' });
  }
};

// ✅ New controller: fetch by both name and date
export const getAttendanceByNameAndDate = async (req: Request, res: Response) => {
  const { name, date } = req.query;

  if (!name || !date) {
    return res.status(400).json({ message: 'Both name and date are required' });
  }

  try {
    const start = new Date(date as string);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const records = await Attendance.find({
      name: new RegExp(name as string, 'i'),
      timestamp: { $gte: start, $lt: end }
    });

    res.json(records);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error fetching attendance' });
  }
};

// ✅ New controller: fetch attendance by name until a given date
export const getAttendanceByNameUntilDate = async (req: Request, res: Response) => {
  console.log('okkk')
  const { name, date } = req.query;

  if (!name || !date) {
    return res.status(400).json({ message: 'Both name and date are required' });
  }

  try {
    const end = new Date(date as string);
    end.setDate(end.getDate() + 1); // include the full day

    const records = await Attendance.find({
      name: new RegExp(name as string, 'i'),
      timestamp: { $lt: end },
    });

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching attendance records up to the given date' });
  }
};
