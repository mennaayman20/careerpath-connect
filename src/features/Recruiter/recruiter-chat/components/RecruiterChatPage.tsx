// ─── RecruiterChat Page ───────────────────────────────────────────────────────

import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { SessionSidebar } from './SessionSidebar';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatInput } from './ChatInput';
import { NewSessionModal } from './NewSessionModal';
import './recruiterChat.css';
import Navbar from '@/components/Navbar';

interface RecruiterChatPageProps {
  defaultJobId?: number;
}
const FIRST_PROMPT = "Give me a quick summary of this job and the top candidates that applied.";

export const RecruiterChatPage: React.FC<RecruiterChatPageProps> = ({ defaultJobId }) => {
  const location = useLocation();

const locationState = location.state as { 
  sessionId?: string; 
  jobTitle?: string;
  autoStart?: boolean;  // ← جديد
  jobId?: number;       // ← جديد
} | null;

  const {
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
  } = useChat();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // جلب الـ sessions عند التحميل
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // لو جه من الـ FAB مع sessionId جاهز — حمّله مباشرة بدون modal
useEffect(() => {
  if (locationState?.sessionId) {
    selectSession(locationState.sessionId);
    window.history.replaceState({}, '');
  } else if (locationState?.autoStart && locationState?.jobId) {
    createSession(locationState.jobId, FIRST_PROMPT);
    window.history.replaceState({}, '');
  } else if (defaultJobId) {
    setIsModalOpen(true);
  }
}, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

 const handleNewChat = () => {
  setIsModalOpen(true);
};

  const handleModalSubmit = async (jobId: number, firstPrompt: string) => {
    setIsModalOpen(false);
    await createSession(jobId, firstPrompt);
  };

  const handleSend = async (message: string) => {
    if (!activeSession) return;
    await sendMessage(activeSession.sessionId, message);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="recruiter-chat flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <SessionSidebar
          sessions={sessions}
          activeSessionId={activeSession?.sessionId}
          isLoading={isLoadingSessions}
          onSelect={selectSession}
          onDelete={deleteSession}
          onNewChat={handleNewChat}
        />

        {/* ── Main Area ── */}
        <main className="chat-main">
          {error && (
            <div className="error-toast" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {error}
              <button onClick={clearError} className="error-toast__close" aria-label="Dismiss">×</button>
            </div>
          )}

          {!activeSession ? (
            <div className="chat-empty">
              <div className="chat-empty__orb" />
              <div className="chat-empty__content">
                <h2>Recruiter Intelligence</h2>
                <p>
                  Start a conversation about any job or candidate. The AI has full
                  context through RAG to answer your questions instantly.
                </p>
                <button className="btn btn--primary btn--lg" onClick={handleNewChat}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  New Chat Session
                </button>
                <div className="chat-empty__suggestions">
                  {[
                    'What are the top skills this candidate has?',
                    'How does this candidate match the job requirements?',
                    "Summarize the candidate's work experience",
                  ].map((s) => (
                    <button key={s} className="suggestion-chip" onClick={handleNewChat}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div className="chat-header__info">
                  <div className="chat-header__dot" />
                  <div>
                    <h3 className="chat-header__title">
                      {activeSession.title || `Job #${activeSession.jobId}`}
                    </h3>
                    <span className="chat-header__meta">
                      Job ID {activeSession.jobId} ·{' '}
                      {new Date(activeSession.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {activeSession.isStreaming && (
                  <div className="chat-header__streaming">
                    <span className="pulse-dot" />
                    AI is thinking…
                  </div>
                )}
              </div>

              <div className="chat-messages">
                {activeSession.messages.map((msg, idx) => (
                  <ChatMessageItem
                    key={idx}
                    message={msg}
                    isStreaming={
                      activeSession.isStreaming &&
                      idx === activeSession.messages.length - 1
                    }
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              <ChatInput
                onSend={handleSend}
                disabled={activeSession.isStreaming}
              />
            </>
          )}
        </main>
      </div>

      {/* ── Modal — بس للـ "New Chat" العادي ── */}
      <NewSessionModal
  isOpen={isModalOpen}
  isLoading={isCreatingSession}
  defaultJobId={activeSession?.jobId ?? defaultJobId}
  sessions={sessions}              // ← جديد
  onClose={() => setIsModalOpen(false)}
  onSubmit={handleModalSubmit}
/>
    </div>
  );
};