// ─── Chat Interfaces ──────────────────────────────────────────────────────────

export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM' | 'TOOL';

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface CreateSessionRequest {
  jobId: number;
  firstPrompt: string;
}

export interface SessionResponse {
  sessionId: string;
  jobId: number;
  title: string;
  createdAt: string;
}

export interface ChatSession extends SessionResponse {
  messages: ChatMessage[];
  isStreaming?: boolean;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}