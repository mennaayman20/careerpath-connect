// ─── SessionSidebar Component ─────────────────────────────────────────────────

import React from 'react';
import type { SessionResponse } from '../interfaces/chat.interfaces';

interface Props {
  sessions: SessionResponse[];
  activeSessionId?: string;
  isLoading: boolean;
  isStreaming?: boolean; // ← جديد
  onSelect: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onNewChat: () => void;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export const SessionSidebar: React.FC<Props> = ({
  sessions,
  activeSessionId,
  isLoading,
  isStreaming,
  onSelect,
  onDelete,
  onNewChat,
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Recruiter Chat</span>
        </div>
       <button
  className="btn-new-chat"
  onClick={onNewChat}
  title={isStreaming ? 'Please wait for the AI to finish' : 'New Chat'}
  disabled={isStreaming}
  style={{ opacity: isStreaming ? 0.4 : 1, cursor: isStreaming ? 'not-allowed' : 'pointer' }}
>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="sidebar__label">Recent Sessions</div>

      <div className="sidebar__list">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="session-skeleton" />
          ))
        ) : sessions.length === 0 ? (
          <div className="sidebar__empty">
            <p>No sessions yet.</p>
            <p>Start a new chat below.</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.sessionId}
              className={`session-item ${activeSessionId === session.sessionId ? 'session-item--active' : ''}`}
              onClick={() => onSelect(session.sessionId)}
            >
              <div className="session-item__icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="session-item__info">
                <span className="session-item__title">{session.title || `Job #${session.jobId}`}</span>
                <span className="session-item__time">{timeAgo(session.createdAt)}</span>
              </div>
              <button
                className="session-item__delete"
                onClick={(e) => { e.stopPropagation(); onDelete(session.sessionId); }}
                title="Delete session"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};