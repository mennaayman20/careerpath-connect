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

const extractApplicationId = (href: string): number | null => {
  const match = href.match(/\/applications\/(\d+)/);
  return match ? Number(match[1]) : null;
};

// ── دالة التطهير الآمنة: بتفصل الكلمات المدموجة بدون مساس بعلامات الـ Markdown ──
const cleanAndSplitText = (text: string): string => {
  if (!text) return '';

  return text.split('\n').map(line => {
    // لو السطر يحتوي على رابط أزرار المتقدمين، بنرجعه فوراً بدون تعديل عشان ميبوظش الـ Render
    if (line.includes('/applications/')) {
      return line;
    }

    // 1. فك الـ CamelCase (مثل: SummaryBoth -> Summary Both)
    // 2. فك التلاحم العشوائي بين الكلمات العادية (مثل: orotherdata-visualizationtools -> orotherdata - visualizationtools)
    // 3. إضافة مسافات آمنة بعد علامات الترقيم (النقاط والفواصل والنقطتين) دون التأثير على الـ Markdown
    const cleanedLine = line
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Za-z0-9])-([A-Za-z0-9])/g, '$1 - $2') 
      .replace(/,([^\s])/g, ', $1')
      .replace(/\.([^\s\d.*#])/g, '. $1') // الـ Regex ده بيحمي النجوم * والهاشتاج # من اللعب في مسافاتهم
      .replace(/:([^\s/])/g, ': $1');

    return cleanedLine;
  }).join('\n');
};

export const ChatMessageItem: React.FC<Props> = ({ message, isStreaming }) => {
  const isUser      = message.role === 'USER';
  const isAssistant = message.role === 'ASSISTANT';

  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  
  // تشغيل المعالجة فقط لرسائل الـ Assistant لضمان انسيابية وعزل نصوص المستخدم
  const processedContent = useMemo(() => {
    if (!isAssistant) return message.content;
    return cleanAndSplitText(message.content);
  }, [message.content, isAssistant]);

  const markdownComponents: Components = {
    a({ href, children }) {
      const appId = href ? extractApplicationId(href) : null;

      if (appId) {
        return (
          <button
            onClick={() => setSelectedAppId(appId)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-sans text-[12px] font-bold uppercase tracking-wide border transition-all duration-200 my-1 inline-block align-middle"
            style={{
              color: '#2D236A',
              background: 'rgba(45,35,106,0.06)',
              borderColor: 'rgba(45,35,106,0.18)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2D236A';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(45,35,106,0.06)';
              e.currentTarget.style.color = '#2D236A';
            }}
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
    // 🔥 إضافة أيقونات مخصصة للنقاط (List Items) تلقائياً من خلال الـ Markdown renderer
    li({ children }) {
      return (
        <li className="flex items-start gap-2 my-1.5 list-none">
          <span className="text-[14px] mt-0.5 select-none">🔹</span>
          <span className="flex-1">{children}</span>
        </li>
      );
    }
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
              className="prose prose-sm text-[15px] max-w-none text-left break-words dark:prose-invert
                         font-medium text-slate-800 dark:text-slate-100
                         prose-p:leading-relaxed prose-p:my-2.5
                         prose-strong:font-black prose-strong:text-[#2D236A] dark:prose-strong:text-purple-400
                         prose-h2:text-base md:prose-h2:text-lg prose-h2:font-black prose-h2:text-[#2D236A] prose-h2:mt-5 prose-h2:mb-2.5
                         prose-ul:my-2 prose-ul:pl-0 prose-li:leading-normal"
              dir="ltr"
            >
              <ReactMarkdown components={markdownComponents}>
                {processedContent || '...'}
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

      {/* Modal التفاصيل */}
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