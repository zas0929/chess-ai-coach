import axios from 'axios';
import { supabase } from '@/lib/supabase';

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  if (!supabase) {
    return config;
  }

  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
