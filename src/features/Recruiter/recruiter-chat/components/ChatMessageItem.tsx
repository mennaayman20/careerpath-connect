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

// ── استخراج الـ application ID من اللينك ─────────────────────────────────────
const extractApplicationId = (href: string): number | null => {
  const match = href.match(/\/applications\/(\d+)/);
  return match ? Number(match[1]) : null;
};

// ── الـ Formatter المحدث لضغط المسافات ومنع التباعد المفرط ──────────────────
const formatMarkdownText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/TupeScript/gi, 'TypeScript')
    .replace(/\r\n/g, '\n')
    .replace(/^(#{1,6})([^\s#])/gm, '$1 $2')
    .replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2')
    .replace(/\n{3,}/g, '\n\n') // تنظيف أي تكرار عشوائي للسطور الفارغة
    .replace(/^(#{1,6}\s.+)\n+/gm, '$1\n') // جعل النصوص تتدفق مباشرة بعد العناوين دون أسطر فارغة
    .trim();
};

// ── أيقونات لكل نوع heading حسب الكلمة المفتاحية ─────────────────────────────
const getHeadingIcon = (children: React.ReactNode): string => {
  const text = String(children ?? '').toLowerCase();
  if (text.includes('conclusion') || text.includes('summary'))  return '🎯';
  if (text.includes('candidate'))                               return '👤';
  if (text.includes('ranked') || text.includes('ranking'))     return '🏆';
  if (text.includes('match') || text.includes('technical'))    return '⚡';
  if (text.includes('evidence'))                               return '🔍';
  if (text.includes('gap'))                                    return '⚠️';
  if (text.includes('role') || text.includes('job'))          return '💼';
  if (text.includes('location'))                              return '📍';
  if (text.includes('stack') || text.includes('tech'))        return '💻';
  if (text.includes('recommendation'))                        return '📝';
  if (text.includes('focus') || text.includes('core'))        return '🎯';
  if (text.includes('result') || text.includes('score'))      return '📊';
  if (text.includes('experience'))                            return '🧠';
  if (text.includes('skill'))                                 return '🚀';
  return '📋';
};

export const ChatMessageItem: React.FC<Props> = ({ message, isStreaming }) => {
  const isUser      = message.role === 'USER';
  const isAssistant = message.role === 'ASSISTANT';

  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);

  const formattedContent = useMemo(
    () => formatMarkdownText(message.content),
    [message.content]
  );

  const markdownComponents: Components = {
    // ── Links → Applicant buttons ─────────────────────────────────────────────
    a({ href, children }) {
      const appId = href ? extractApplicationId(href) : null;
      if (appId) {
        return (
          <button
            onClick={() => setSelectedAppId(appId)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-syne text-[11px] font-bold uppercase tracking-wide border transition-all duration-200 mx-0.5"
            style={{ color: '#2D236A', background: 'rgba(45,35,106,0.07)', borderColor: 'rgba(45,35,106,0.18)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#2D236A'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(45,35,106,0.07)'; e.currentTarget.style.color = '#2D236A'; }}
          >
            👤 View Applicant #{appId}
          </button>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-[#1ca37b] hover:opacity-75 transition-opacity">
          {children}
        </a>
      );
    },

    // ── Paragraphs (مسافات ملمومة لتبدو كبرجراف طبيعي ومتناسق) ────────────────
    p({ children }) {
      return (
        <p className="my-1 leading-6 text-[0.95rem] tracking-normal text-foreground/90 text-justify">
          {children}
        </p>
      );
    },

    // ── Headings (مسافات مضبوطة للفصل بين الـ Candidates مع الأيقونات) ──────────
    h1({ children }) {
      return (
        <h1 className="flex items-center gap-2 text-xl font-extrabold text-primary mt-6 mb-2 pb-1 border-b border-border/40">
          <span>{getHeadingIcon(children)}</span>
          <span>{children}</span>
        </h1>
      );
    },
    h2({ children }) {
      return (
        <h2 className="flex items-center gap-2 text-lg font-bold text-primary mt-5 mb-1.5 pb-0.5 border-b border-border/30">
          <span>{getHeadingIcon(children)}</span>
          <span>{children}</span>
        </h2>
      );
    },
    h3({ children }) {
      return (
        <h3 className="flex items-center gap-2 text-base font-bold text-primary/90 mt-4 mb-1">
          <span>{getHeadingIcon(children)}</span>
          <span>{children}</span>
        </h3>
      );
    },
    h4({ children }) {
      return (
        <h4 className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80 mt-3 mb-0.5">
          <span>{getHeadingIcon(children)}</span>
          <span>{children}</span>
        </h4>
      );
    },

    // ── Lists (تضييق النقط وضمان المحاذاة الرأسية للأيقونات والنقط المخصصة) ────
    ul({ children }) {
      return <ul className="my-1 pl-1 space-y-1">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="my-1 pl-5 space-y-1 list-decimal">{children}</ol>;
    },
    // li({ children }) {
    //   return (
    //     <li className="flex items-start gap-2 leading-5 text-[0.93rem] text-foreground/90">
    //       {/* نقطة مخصصة ومحاذية تماماً لمنتصف السطر الأول */}
    //       <span className="w-1.5 h-1.5 rounded-full bg-foreground/70 mt-[7px] shrink-0" />
    //       <span className="flex-1">{children}</span>
    //     </li>
    //   );
    // },

    // ── Code ──────────────────────────────────────────────────────────────────
    code({ children, className }) {
      const isBlock = className?.includes('language-');
      if (isBlock) {
        return (
          <code className={`block bg-muted/60 rounded-md px-3 py-2 text-xs font-mono overflow-x-auto my-1.5 ${className}`}>
            {children}
          </code>
        );
      }
      return (
        <code className="bg-muted/60 rounded px-1.5 py-0.5 text-xs font-mono text-primary/90">
          {children}
        </code>
      );
    },

    // ── Blockquote ────────────────────────────────────────────────────────────
    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 border-primary/30 pl-4 my-2 text-foreground/70 italic">
          {children}
        </blockquote>
      );
    },

    // ── Strong / Em ───────────────────────────────────────────────────────────
    strong({ children }) {
      return <strong className="font-bold text-primary/95">{children}</strong>;
    },
    em({ children }) {
      return <em className="italic text-foreground/80">{children}</em>;
    },

    // ── HR ────────────────────────────────────────────────────────────────────
    hr() {
      return <hr className="my-3 border-border/30" />;
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
              className="max-w-none text-left break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
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