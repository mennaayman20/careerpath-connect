"use client";

import React, { useMemo, useState } from 'react';
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

// ── استخراج الـ application ID من اللينك ──────────────────────────────────────
const extractApplicationId = (href: string): number | null => {
  const match = href.match(/\/applications\/(\d+)/);
  return match ? Number(match[1]) : null;
};

const formatMarkdownText = (text: string) => {
  if (!text) return '';
  return text
    .replace(/TupeScript/gi, 'TypeScript')
    .replace(/→/g, ' ➔ ')
    .replace(/\r\n/g, '\n')
    .replace(/\n\s*\*\s*\n/g, '\n')
    .replace(/###\s*/g, '\n### 📋 ')
    .replace(/\*\*Conclusion\*\*/gi, '\n### 🎯 Conclusion')
    .replace(/Conclusion\*/gi, 'Conclusion')
    .replace(/•\s*Candidate/g, 'Candidate')
    .replace(/Candidate\s*(\d+)(\s*\(ID\s*\d+\))?\*?/gi, '\n#### 👤 Candidate $1')
    .replace(/(Technical\s*Match\s*:\s*|\bMatch\s*Quality\s*:\s*)/gi, '\n⚡ Match Quality: ')
    .replace(/(\*?\s*\*?Evidence\s*:\s*\*?\s*\*?)/gi, '\n🔍 Evidence: ')
    .replace(/(\*?\s*\*?Gaps\s*:\s*\*?\s*\*?)/gi, '\n⚠️ Gaps: ')
    .replace(/Role\s*:/gi, '\n💼 Role:')
    .replace(/Location\s*:/gi, '\n📍 Location:')
    .replace(/Core\s*Focus\s*:/gi, '\n🎯 Core Focus:')
    .replace(/Required\s*Tech\s*Stack\s*:/gi, '\n💻 Required Tech Stack:')
    .replace(/Recommendation\s*:/gi, '\n📝 Recommendation:')
    .replace(/\n\s*\*\s*([^*:\n]+):/g, '\n🚀 $1:')
    .replace(/\*/g, '')
    .replace(/Ranked\s*Candidates\s*:/gi, '\n🏆 Ranked Candidates:')
    .replace(/\n\s*\d+\.\s*\n*\s*/g, (match) => `\n${match.match(/\d+/)?.[0]}. `)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

export const ChatMessageItem: React.FC<Props> = ({ message, isStreaming }) => {
  const isUser      = message.role === 'USER';
  const isAssistant = message.role === 'ASSISTANT';

  // ── State للـ modal ────────────────────────────────────────────────────────
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);

  const formattedContent = useMemo(() => formatMarkdownText(message.content), [message.content]);

  // ── Custom renderer لتحويل اللينكات لأزرار ────────────────────────────────
  const markdownComponents: Components = {
    a({ href, children }) {
      const appId = href ? extractApplicationId(href) : null;

      if (appId) {
        return (
          <button
            onClick={() => setSelectedAppId(appId)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-syne text-[11px] font-bold uppercase tracking-wide border transition-all duration-200 mx-0.5"
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
            👤 View Applicant #{appId}
          </button>
        );
      }

      // لينك عادي
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
        {isUser
          ? <span className="avatar avatar--user">You</span>
          : <span className="avatar avatar--ai">AI</span>
        }
      </div>

      <div className="chat-message__body">
        <div className="chat-message__bubble">
          {isAssistant ? (
            <div
              className="prose prose-sm md:prose-base max-w-none text-left break-words dark:prose-invert
                         prose-p:leading-relaxed prose-p:my-1 prose-p:text-foreground/90
                         prose-h3:text-base prose-h3:font-extrabold prose-h3:text-primary prose-h3:mt-3 prose-h3:mb-1 prose-h3:pb-0.5 prose-h3:border-b prose-h3:border-border/40
                         prose-h4:text-sm prose-h4:font-bold prose-h4:text-foreground/80 prose-h4:mt-2 prose-h4:mb-0.5
                         prose-strong:text-primary/95 prose-strong:font-semibold
                         prose-ul:my-0.5 prose-ul:pl-4 prose-li:my-0.2 prose-li:leading-normal"
              dir="ltr"
            >
              <ReactMarkdown components={markdownComponents}>
                {formattedContent || '...'}
              </ReactMarkdown>

              {isStreaming && (
                <span className="typing-cursor inline-block ml-1 animate-pulse" aria-hidden="true">▍</span>
              )}
            </div>
          ) : (
            <span className="whitespace-pre-wrap">{message.content}</span>
          )}
        </div>
        <span className="chat-message__time">{formatTime(message.timestamp)}</span>
      </div>

      {/* ── Modal يفتح لما الـ user يضغط على زرار الـ applicant ── */}
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