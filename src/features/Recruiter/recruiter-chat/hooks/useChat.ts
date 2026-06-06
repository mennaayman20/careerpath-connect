import { useState, useCallback, useRef, useEffect } from 'react';
import { chatService } from '../services/chatService';
import type {
  ChatSession,
  ChatMessage,
  SessionResponse,
} from '../interfaces/chat.interfaces';

interface UseChatReturn {
  sessions: SessionResponse[];
  activeSession: ChatSession | null;
  isLoadingSessions: boolean;
  isCreatingSession: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  createSession: (jobId: number, firstPrompt: string) => Promise<void>;
  selectSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  sendMessage: (sessionId: string, prompt: string) => Promise<void>;
  clearError: () => void;
}

function appendChunk(
  setActiveSession: React.Dispatch<React.SetStateAction<ChatSession | null>>,
  chunk: string
) {
  setActiveSession((prev) => {
    if (!prev) return prev;
    const msgs = [...prev.messages];
    const lastIdx = msgs.length - 1;
    if (lastIdx < 0) return prev;
    const last = { ...msgs[lastIdx] };
    last.content += chunk;
    msgs[lastIdx] = last;
    return { ...prev, messages: msgs };
  });
}

export function useChat(): UseChatReturn {
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

const freshSignal = useCallback(() => {
  abortRef.current?.abort();           // ← abort الأول أولاً
  const controller = new AbortController();
  abortRef.current = controller;
  return controller.signal;
}, []);

  // ── Fetch all sessions ──────────────────────────────────────────────────────
  const fetchSessions = useCallback(async () => {
    setIsLoadingSessions(true);
    setError(null);
    try {
      const data = await chatService.getSessions();
      setSessions(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  // ── Create new session then stream the first response ───────────────────────
  const createSession = useCallback(async (jobId: number, firstPrompt: string) => {
    setIsCreatingSession(true);
    setError(null);
    try {
      const session = await chatService.createSession({ jobId, firstPrompt });
      setSessions((prev) => [session, ...prev]);

      const userMsg: ChatMessage = {
        role: 'USER',
        content: firstPrompt,
        timestamp: new Date().toISOString(),
      };
      const placeholderMsg: ChatMessage = {
        role: 'ASSISTANT',
        content: '',
        timestamp: new Date().toISOString(),
      };

      setActiveSession({ ...session, messages: [userMsg, placeholderMsg], isStreaming: true });

      await chatService.consumeStream(
        session.sessionId,
        firstPrompt,
        (chunk) => appendChunk(setActiveSession, chunk),
        freshSignal()
      );
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setError((e as Error).message);
    } finally {
      setActiveSession((prev) => (prev ? { ...prev, isStreaming: false } : prev));
      setIsCreatingSession(false);
    }
  }, [freshSignal]);

  // ── Load existing session messages ──────────────────────────────────────────
  const selectSession = useCallback(async (sessionId: string) => {
    setError(null);
    try {
      const sessionMeta = sessions.find((s) => s.sessionId === sessionId);
      if (!sessionMeta) return;
      const messages = await chatService.getMessages(sessionId);
      setActiveSession({ ...sessionMeta, messages, isStreaming: false });
    } catch (e) {
      setError((e as Error).message);
    }
  }, [sessions]);

  // ── Send follow-up message ──────────────────────────────────────────────────
  const sendMessage = useCallback(async (sessionId: string, prompt: string) => {
    setError(null);

    const signal = freshSignal(); // ← controller جديد قبل abort القديم

    const userMsg: ChatMessage = {
      role: 'USER',
      content: prompt,
      timestamp: new Date().toISOString(),
    };
    const placeholderMsg: ChatMessage = {
      role: 'ASSISTANT',
      content: '',
      timestamp: new Date().toISOString(),
    };

    setActiveSession((prev) =>
      prev
        ? { ...prev, messages: [...prev.messages, userMsg, placeholderMsg], isStreaming: true }
        : prev
    );

    try {
      await chatService.consumeStream(
        sessionId,
        prompt,
        (chunk) => appendChunk(setActiveSession, chunk),
        signal
      );
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setError((e as Error).message);
      }
    } finally {
      setActiveSession((prev) => (prev ? { ...prev, isStreaming: false } : prev));
    }
  }, [freshSignal]);

  // ── Delete session ──────────────────────────────────────────────────────────
  const deleteSession = useCallback(async (sessionId: string) => {
    setError(null);
    try {
      await chatService.deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
      setActiveSession((prev) => (prev?.sessionId === sessionId ? null : prev));
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  return {
    sessions,
    activeSession,
    isLoadingSessions,
    isCreatingSession,
    error,
    fetchSessions,
    createSession,
    selectSession,
    deleteSession,
    sendMessage,
    clearError,
  };
}