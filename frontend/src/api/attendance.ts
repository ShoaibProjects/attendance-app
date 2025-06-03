// src/api/attendance.ts
import axios from './axiosInstance';

export const fetchAttendanceByDate = (date: string) =>
  axios.get(`/api/attendance/by-date?date=${date}`);

export const fetchAttendanceByName = (name: string) =>
  axios.get(`/api/attendance/by-name/${name}`);

// ✅ New function to fetch by both name and date
export const fetchAttendanceByNameAndDate = (name: string, date: string) =>
  axios.get(`/api/attendance/by-name-and-date?name=${name}&date=${date}`);