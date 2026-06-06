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

// المشكلة: السيرفر ممكن يبعت chunks متقطعة تقطع في نص الـ "data:" line
// الحل: buffer الـ lines عشان نتأكد إن كل سطر اتكمل
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
  let buffer = "";

  const processLine = (line: string) => {
    if (!line.startsWith("data:")) return;
    const raw = line.replace(/^data:\s*/, "").trim();
    if (!raw || raw === "[DONE]") return;
    try {
      const parsed = JSON.parse(raw);
      onChunk(parsed?.content ?? parsed?.delta ?? raw);
    } catch {
      onChunk(raw);
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // ← flush TextDecoder + عالج اللي فضل في الـ buffer
        buffer += decoder.decode();
        if (buffer.trim()) processLine(buffer.trim());
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.includes("event:done")) return;
        processLine(line.trim());
      }
    }
  } finally {
    reader.releaseLock();
  }
},


};