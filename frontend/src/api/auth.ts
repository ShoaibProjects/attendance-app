// src/api/auth.ts
import axios from './axiosInstance';

export const registerUser = (data: { name: string; email: string; password: string }) =>
  axios.post('/users/register', data);

export const loginUser = (data: { email: string; password: string }) =>
  axios.post('/users/login', data);
