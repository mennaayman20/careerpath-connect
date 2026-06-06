"use client";

import React, { useMemo, useState } from 'react';
import type { ChatMessage as IChatMessage } from '../interfaces/chat.interfaces';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm'; 
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

// 🎯 دالة ذكية ومحدثة لإضافة إيموجيز متوافقة تماماً مع ردود التقييم
const injectEmojis = (text: string): string => {
  return text
    // الكلمات المفتاحية للتقييم (Matches, Gaps, Context)
    .replace(/(Matches|المطابقات)/gi, '✅ $1')
    .replace(/(Gaps|الفجوات)/gi, '❌ $1')
    .replace(/(Context|السياق العام)/gi, '🔍 $1')
    // كلمات التوظيف والبيانات الأخرى
    .replace(/(الموقع|العنوان|Location)/gi, '📍 $1')
    .replace(/(الهاتف|رقم التواصل|Phone)/gi, '📞 $1')
    .replace(/(البريد الإلكتروني|الإيميل|Email)/gi, '✉️ $1')
    .replace(/(السيرة الذاتية|الملف|Resume|CV)/gi, '📄 $1')
    .replace(/(المميزات|الإيجابيات|Pros)/gi, '✨ $1')
    .replace(/(العيوب|الملاحظات|Cons)/gi, '⚠️ $1');
};

const cleanAndSplitText = (text: string): string => {
  if (!text) return '';

  // 1️⃣ إزالة جميع علامات النجمة
  let cleanedText = text.replace(/\*/g, '');

  // 2️⃣ تنظيف الأقواس الزائدة حول روابط الـ Applications حتى لا يتشوه مظهر الزر
  cleanedText = cleanedText.replace(/\((Application:\s*)?\[([^\]]+)\]\(([^)]+)\)\)/g, ' [$2]($3)');

  // 3️⃣ إضافة الإيموجيز التلقائية
  cleanedText = injectEmojis(cleanedText);

  return cleanedText.split('\n').map(line => {
    if (line.includes('/applications/')) {
      return line;
    }
    const cleanedLine = line
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Za-z0-9])-([A-Za-z0-9])/g, '$1 - $2') 
      .replace(/,([^\s])/g, ', $1')
      .replace(/\.([^\s\d.*#])/g, '. $1') 
      .replace(/:([^\s/])/g, ': $1');

    return cleanedLine;
  }).join('\n');
};

export const ChatMessageItem: React.FC<Props> = ({ message, isStreaming }) => {
  const isUser      = message.role === 'USER';
  const isAssistant = message.role === 'ASSISTANT';

  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  
  const processedContent = useMemo(() => {
    if (message.role !== 'ASSISTANT') {
      return injectEmojis(message.content.replace(/\*/g, ''));
    }
    if (isStreaming) {
      return injectEmojis(message.content.replace(/\*/g, ''));
    }
    return cleanAndSplitText(message.content);
  }, [message.content, message.role, isStreaming]);

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
          🔗 {children}
        </a>
      );
    },
    li({ children }) {
      return (
        <li className="flex items-start gap-2 my-1.5 list-none text-slate-800 dark:text-slate-100">
          <span className="text-[14px] mt-0.5 select-none text-[#2D236A] dark:text-purple-400">🔹</span>
          <span className="flex-1">{children}</span>
        </li>
      );
    },
    table({ children }) {
      return (
        <div className="overflow-x-auto my-4 border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-left">{children}</table>
        </div>
      );
    },
    th({ children }) {
      return <th className="px-4 py-2 bg-slate-50 font-bold text-slate-700 border-b">{children}</th>;
    },
    td({ children }) {
      return <td className="px-4 py-2 border-b text-slate-600">{children}</td>;
    }
  };

  return (
    <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'} flex gap-4 p-4`}>

      <div className="chat-message__avatar shrink-0">
        {isUser ? (
          <span className="avatar w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700"> You</span>
        ) : (
          <span className="avatar w-8 h-8 rounded-full bg-[#2D236A] text-white flex items-center justify-center font-bold text-xs"> AI</span>
        )}
      </div>

      <div className="chat-message__body flex-1">
        <div className="chat-message__bubble">
          {isAssistant ? (
            <div
              className="prose prose-sm text-[15px] max-w-none text-left break-words dark:prose-invert
                         font-medium text-slate-800 dark:text-slate-100
                         prose-p:leading-relaxed prose-p:my-2
                         prose-strong:font-black prose-strong:text-[#2D236A] dark:prose-strong:text-purple-400
                         prose-h2:text-base md:prose-h2:text-lg prose-h2:font-black prose-h2:text-[#2D236A] prose-h2:mt-4 prose-h2:mb-2
                         prose-ul:my-2 prose-ul:pl-0 prose-li:leading-normal"
              dir="auto" 
            >
              {isStreaming && !processedContent ? (
                <div className="flex items-center gap-1 py-2" aria-label="AI is thinking">
  <div className="w-1.5 h-1.5 bg-[#2D236A] rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:-0.2s]"></div>
  <div className="w-1.5 h-1.5 bg-[#2D236A] rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:-0.1s]"></div>
  <div className="w-1.5 h-1.5 bg-[#2D236A] rounded-full animate-bounce [animation-duration:0.6s]"></div>
</div>
              ) : (
                <>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {processedContent}
                  </ReactMarkdown>
                  
                  {isStreaming && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-[#2D236A] animate-pulse align-middle" />
                  )}
                </>
              )}
            </div>
          ) : (
            <span className="whitespace-pre-wrap text-[15px] text-white block">
              {processedContent}
            </span>
          )}
        </div>
        <span className="chat-message__time text-xs text-slate-400 mt-1 block"> {formatTime(message.timestamp)}</span>
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