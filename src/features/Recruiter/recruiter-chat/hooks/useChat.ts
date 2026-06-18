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
  // 💡 استخدام Ref لمتابعة حالة الحماية منعاً لتغيير الـ useCallback reference
  const isCreatingRef = useRef(false); 

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  // ── Helper: إدارة الـ AbortController بشكل آمن ──────────────────────
  const freshSignal = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
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

  // ── Create new session ──────────────────────────────────────────────────────
  const createSession = useCallback(async (jobId: number, firstPrompt: string) => {
    if (isCreatingRef.current) return; // الحماية عن طريق الـ Ref مستقرة تماماً
    
    isCreatingRef.current = true;
    setIsCreatingSession(true);
    setError(null);
    
    try {
      const signal = freshSignal(); 
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
        signal 
      );
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setError((e as Error).message);
      }
    } finally {
      setActiveSession((prev) => (prev ? { ...prev, isStreaming: false } : prev));
      setIsCreatingSession(false);
      isCreatingRef.current = false;
    }
  }, [freshSignal]); // 💡 Reference ثابت لا يتغير بتغير حالة الـ Loading

  // ── Load existing session messages ──────────────────────────────────────────
  const selectSession = useCallback(async (sessionId: string) => {
    setError(null);
    try {
      // نستخدم الـ Functional state لتجنب الاعتماد على sessions الخارجية
      setSessions((currentSessions) => {
        const sessionMeta = currentSessions.find((s) => s.sessionId === sessionId);
        if (sessionMeta) {
          chatService.getMessages(sessionId)
            .then((messages) => {
              setActiveSession({ ...sessionMeta, messages, isStreaming: false });
            })
            .catch((e) => setError((e as Error).message));
        }
        return currentSessions;
      });
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  // ── Send follow-up message ──────────────────────────────────────────────────
  const sendMessage = useCallback(async (sessionId: string, prompt: string) => {
    setError(null);
    const signal = freshSignal(); 

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
  }, [freshSignal]); // 💡 إضافة الـ dependency الصحيح هنا

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