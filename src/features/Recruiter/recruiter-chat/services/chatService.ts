import { api } from "@/lib/api";
import type {
  CreateSessionRequest,
  SessionResponse,
  ChatMessage,
} from '../interfaces/chat.interfaces';

export const chatService = {
  // ── GET /jobs/chat/sessions ─────────────────────────────────────────────────
  getSessions: async (): Promise<SessionResponse[]> => {
    const response = await api.get<SessionResponse[]>("/jobs/chat/sessions");
    return response.data;
  },

  // ── POST /jobs/chat/sessions ────────────────────────────────────────────────
  createSession: async (payload: CreateSessionRequest): Promise<SessionResponse> => {
    const response = await api.post<SessionResponse>("/jobs/chat/sessions", payload);
    return response.data;
  },

  // ── GET /jobs/chat/sessions/{sessionId}/messages ────────────────────────────
  getMessages: async (sessionId: string): Promise<ChatMessage[]> => {
    const response = await api.get<ChatMessage[]>(`/jobs/chat/sessions/${sessionId}/messages`);
    return response.data;
  },

  // ── POST /jobs/chat/sessions/{sessionId}/messages ────────────────────────────
  sendPrompt: async (sessionId: string, content: string, signal?: AbortSignal): Promise<void> => {
    await api.post(`/jobs/chat/sessions/${sessionId}/messages`, { content }, { signal });
  },

  // ── DELETE /jobs/chat/sessions/{sessionId} ──────────────────────────────────
  deleteSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/jobs/chat/sessions/${sessionId}`);
  },

  // ── GET /jobs/chat/sessions/{sessionId}/stream ──────────────────────────────
  consumeStream: async (
    sessionId: string,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
  ): Promise<void> => {
    const baseUrl = api.defaults.baseURL || "";
    const res = await fetch(`${baseUrl}/jobs/chat/sessions/${sessionId}/stream`, { signal });

    if (!res.ok) throw new Error(`Stream failed: ${res.statusText}`);
    if (!res.body) throw new Error('No response body');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter((l) => l.startsWith('data: '));

        for (const line of lines) {
          const raw = line.replace('data: ', '').trim();
          if (raw === '[DONE]') return;
          try {
            const parsed = JSON.parse(raw);
            onChunk(parsed?.content ?? parsed?.delta ?? raw);
          } catch {
            onChunk(raw);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },
};