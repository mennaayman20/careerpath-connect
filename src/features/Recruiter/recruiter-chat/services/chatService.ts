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
    
    // 💡 الـ Buffer السحري لتجميع السطور المكسورة ومنع التداخل واللزق
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // بنزود التكست الجديد على الـ buffer
        buffer += decoder.decode(value, { stream: true });
        
        // بنقسم السطور بناءً على الـ newline
        const lines = buffer.split("\n");

        // 💡 السطر الأخير ممكن يكون مكسور أو لسه مكملش من السيرفر، فنشيله ونحتفظ بيه للمرة الجاية
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmedLine = line.trim();

          // تجاهل الأسطر الفاضية أو الـ events التوضيحية
          if (!trimmedLine || trimmedLine.startsWith("event:")) continue;

          if (trimmedLine.startsWith("data:")) {
            // شيل كلمة data: ونضف المسافات الخارجية فقط
            const raw = trimmedLine.replace(/^data:\s*/, "");

            if (raw === "[DONE]") return;

            try {
              const parsed = JSON.parse(raw);
              let content = parsed?.content ?? parsed?.delta ?? raw;
              
              // لو الـ content راجع فيه رموز سطر جديد نصية، بنحولها لـ Newlines حقيقية (\n) للـ Markdown
              if (typeof content === "string") {
                content = content.replace(/\\n/g, "\n");
              }
              onChunk(content);
            } catch {
              // لو الداتا مش JSON سليم (Plain text token)
              const plainText = raw.replace(/\\n/g, "\n");
              onChunk(plainText);
            }
          }
        }
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log("Stream dynamic connection aborted cleanly.");
        return;
      }
      throw error;
    } finally {
      reader.releaseLock();
    }
  },
};