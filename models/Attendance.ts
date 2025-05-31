// src/models/Attendance.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  meetingId: string;
  name: string;
  email: string;
  join_time: string;
  leave_time: string;
  duration: number;
  timestamp: Date;
}

const AttendanceSchema = new Schema<IAttendance>({
  meetingId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String},
  join_time: { type: String, required: true },
  leave_time: { type: String, required: true },
  duration: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
