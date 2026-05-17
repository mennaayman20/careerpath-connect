// ─── ChatMessage Component ────────────────────────────────────────────────────

import React from 'react';
import type { ChatMessage as IChatMessage } from '../interfaces/chat.interfaces';

interface Props {
  message: IChatMessage;
  isStreaming?: boolean;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const ChatMessageItem: React.FC<Props> = ({ message, isStreaming }) => {
  const isUser = message.role === 'USER';
  const isAssistant = message.role === 'ASSISTANT';

  return (
    <div
      className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'}`}
    >
      {/* Avatar */}
      <div className="chat-message__avatar">
        {isUser ? (
          <span className="avatar avatar--user">You</span>
        ) : (
          <span className="avatar avatar--ai">AI</span>
        )}
      </div>

      {/* Bubble */}
      <div className="chat-message__body">
        <div className="chat-message__bubble">
          {message.content || (isStreaming && isAssistant ? '' : '...')}
          {isStreaming && isAssistant && (
            <span className="typing-cursor" aria-hidden="true" />
          )}
        </div>
        <span className="chat-message__time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
};