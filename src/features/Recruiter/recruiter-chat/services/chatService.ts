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

  // ── DELETE /jobs/chat/sessions/{sessionId} ──────────────────────────────────
  deleteSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/jobs/chat/sessions/${sessionId}`);
  },

  // ── GET /jobs/chat/sessions/{sessionId}/stream?question=... ─────────────────
  // بيستخدم fetch عشان SSE
  // الـ question بيتبعت كـ query param في الـ URL
  consumeStream: async (
    sessionId: string,
    question: string,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
  ): Promise<void> => {
    const baseUrl = api.defaults.baseURL ?? "";
    const token   = localStorage.getItem("token") ?? "";

    const url = `${baseUrl}/jobs/chat/sessions/${sessionId}/stream?question=${encodeURIComponent(question)}`;

    const res = await fetch(url, {
      signal,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "text/event-stream",
      },
    });

    if (!res.ok) throw new Error(`Stream failed: ${res.status} ${res.statusText}`);
    if (!res.body) throw new Error("No response body");

    const reader  = res.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text  = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          // السيرفر بيبعت: event:token / event:done
          // نتجاهل سطور الـ event ونشتغل بس على سطور الـ data
          if (!line.startsWith("data:")) continue;

          // شيل "data:" سواء بمسافة أو بدونها
          const raw = line.replace(/^data:\s*/, "").trim();

          if (raw === "") continue;

          // لو وصلنا [DONE] أو event:done — نخرج فوراً
          if (raw === "[DONE]") return;

          try {
            const parsed = JSON.parse(raw);
            onChunk(parsed?.content ?? parsed?.delta ?? raw);
          } catch {
            // الـ data مش JSON — ابعتها مباشرة (plain text token)
            onChunk(raw);
          }
        }

        // لو السيرفر بعت event:done في نفس الـ chunk
        if (text.includes("event:done")) return;
      }
    } finally {
      reader.releaseLock();
    }
  },
};