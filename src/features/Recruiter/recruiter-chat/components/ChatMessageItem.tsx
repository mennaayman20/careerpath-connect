"use client";

import React, { useState } from 'react';
import type { ChatMessage as IChatMessage } from '../interfaces/chat.interfaces';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { ApplicantDetailModal } from '@/features/Recruiter/MangeJobs/components/applicant/ApplicantDetailModal';
import type { ApplicationResponse } from '@/features/Recruiter/MangeJobs/types/recruiter.types';
import { createPortal } from 'react-dom';

interface Props {
  message: IChatMessage;
  isStreaming?: boolean;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const extractApplicationId = (href: string): number | null => {
  const match = href.match(/\/applications\/(\d+)/);
  return match ? Number(match[1]) : null;
}

export const ChatMessageItem: React.FC<Props> = ({ message, isStreaming }) => {
  const isUser      = message.role === 'USER';
  const isAssistant = message.role === 'ASSISTANT';

  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);

  const markdownComponents: Components = {
    a({ href, children }) {
      const appId = href ? extractApplicationId(href) : null;
      if (appId) {
        return (
          <button
            onClick={() => setSelectedAppId(appId)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-syne text-[11px] font-bold uppercase tracking-wide border transition-all duration-200 mx-1 my-0.5"
            style={{
              color: '#2D236A',
              background: 'rgba(45,35,106,0.07)',
              borderColor: 'rgba(45,35,106,0.18)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2D236A';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(45,35,106,0.07)';
              e.currentTarget.style.color = '#2D236A';
            }}
          >
            👤 View Applicant 
          </button>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-[#1ca37b] hover:opacity-75 transition-opacity">
          {children}
        </a>
      );
    },
  };

  return (
    <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'}`}>
      <div className="chat-message__avatar">
        {isUser ? <span className="avatar avatar--user">You</span> : <span className="avatar avatar--ai">AI</span>}
      </div>

      <div className="chat-message__body">
        <div className="chat-message__bubble">
          {isAssistant ? (
            <div
              className="prose prose-sm md:prose-base max-w-none text-left text-black
              /* الكلاس السحري لحل مشكلة البث */
              whitespace-pre-wrap break-words [word-spacing:0.05em]
              
              prose-p:leading-relaxed prose-p:my-1.5 prose-p:text-black
              prose-headings:text-black prose-headings:font-bold prose-headings:mt-3 prose-headings:mb-1
              prose-strong:text-black prose-strong:font-bold
              prose-ul:my-1 prose-ul:pl-4 prose-li:my-0.5"
              style={{ 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                letterSpacing: '0.01em'
              }}
              dir="ltr"
            >
              {/* 💡 لو الـ content لسه فاضي وهو بيعمل Streaming، اعرض شكل "التفكير" */}
              {isStreaming && !message.content ? (
                <div className="flex items-center space-x-1 py-2" aria-label="AI is thinking">
                  <div className="w-1.5 h-1.5 bg-[#2D236A] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#2D236A] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#2D236A] rounded-full animate-bounce"></div>
                </div>
              ) : (
                <ReactMarkdown components={markdownComponents}>
                  {message.content}
                </ReactMarkdown>
              )}

              {/* مؤشر الـ Cursor العادي يظهر بس لما يبدأ الكلام فعلاً */}
              {isStreaming && message.content && (
                <span className="typing-cursor inline-block ml-1 animate-pulse text-black" aria-hidden="true">▍</span>
              )}
            </div>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
          )}
        </div>
        <span className="chat-message__time">{formatTime(message.timestamp)}</span>
      </div>

      {selectedAppId && createPortal(
        <ApplicantDetailModal
          application={{ id: selectedAppId } as ApplicationResponse}
          onClose={() => setSelectedAppId(null)}
        />,
        document.body
      )}
    </div>
  );
};