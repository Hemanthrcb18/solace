import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use(cfg => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('mentora_token') : null;
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export interface Scores {
  engagement_score: number;
  clarity_score: number;
  concept_coverage_score: number;
  pedagogy_score: number;
  overall_score: number;
}

export interface Sentiment {
  sentiment_score: number;
  emotion_label: string;
  positive_ratio: number;
  confusion_ratio: number;
  engagement_ratio: number;
  question_density: number;
}

export interface AICoach {
  primary_tip: string;
  if_i_were_teacher: string;
  recommended_strategy: string;
  emotion_advice: string;
  improvement_priority: string[];
  strength_to_leverage: string;
  overall_coaching: string;
}

export interface EvalResult {
  evaluation_id: string;
  scores: Scores;
  reasoning: string;
  suggestions: string[];
  sentiment: Sentiment;
  ai_coach: AICoach;
  improvement_priority: string[];
  evaluation_source: string;
  video_filename?: string;
  evaluated_at: string;
}

export const apiService = {
  login: async () => {
    const r = await api.post('/auth/demo-login');
    const token = r.data.access_token;
    if (token) localStorage.setItem('mentora_token', token);
    return r.data;
  },
  isAuth: () => typeof window !== 'undefined' && !!localStorage.getItem('mentora_token'),
  logout: () => localStorage.removeItem('mentora_token'),

  uploadVideo: async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const r = await api.post('/upload/video', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return r.data as { video_id: string; filename: string; s3_url: string; file_size: number; storage: string };
  },

  evaluate: async (payload: { video_id?: string; transcribed_text?: string; syllabus_text: string; teaching_objectives?: string }) => {
    const r = await api.post('/evaluate', payload);
    return r.data as EvalResult;
  },

  quickEvaluate: async (transcribed_text: string, syllabus_text: string, teaching_objectives?: string) => {
    const r = await api.post('/quick-evaluate', { transcribed_text, syllabus_text, teaching_objectives });
    return r.data as EvalResult;
  },

  getHistory: async () => {
    const r = await api.get('/evaluations');
    return r.data as { evaluations: any[]; count: number };
  },

  health: async () => {
    const r = await api.get('/health');
    return r.data;
  },
};
