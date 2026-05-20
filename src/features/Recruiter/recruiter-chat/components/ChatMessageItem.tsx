import React, { useMemo } from 'react';
import type { ChatMessage as IChatMessage } from '../interfaces/chat.interfaces';
import ReactMarkdown from 'react-markdown';

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

// دالة تنظيف وتنسيق النصوص - تم تقليل الـ \n الزائدة لمنع تباعد الأسطر
const formatMarkdownText = (text: string) => {
  if (!text) return '';
  
  return text
    // 1. تصحيح الأخطاء الإملائية وتوحيد السطور والمسافات
    .replace(/TupeScript/gi, 'TypeScript')
    .replace(/→/g, ' ➔ ')
    .replace(/\r\n/g, '\n')
    
    // 2. تنظيف النجوم العشوائية الطايرة في سطور مستقلة
    .replace(/\n\s*\*\s*\n/g, '\n')

    // 3. ضبط العناوين الرئيسية بشكل ملموم (استخدمنا \n واحدة لأن الـ Markdown سيتعامل مع الـ Heading تلقائياً)
    .replace(/###\s*/g, '\n### 📋 ') 
    .replace(/\*\*Conclusion\*\*/gi, '\n### 🎯 Conclusion') 
    .replace(/Conclusion\*/gi, 'Conclusion')

    // 4. جعل كل Candidate يبدأ كـ عنوان (H4) واضح
    .replace(/•\s*Candidate/g, 'Candidate')
    .replace(/Candidate\s*(\d+)(\s*\(ID\s*\d+\))?\*?/gi, '\n#### 👤 Candidate $1')

    // 5. هيكلة الـ Labels الرئيسية وتوحيد شكلها
    .replace(/(Technical\s*Match\s*:\s*|\bMatch\s*Quality\s*:\s*)/gi, '\n⚡ Match Quality: ')
    .replace(/(\*?\s*\*?Evidence\s*:\s*\*?\s*\*?)/gi, '\n🔍 Evidence: ')
    .replace(/(\*?\s*\*?Gaps\s*:\s*\*?\s*\*?)/gi, '\n⚠️ Gaps: ')
    
    // ضبط بقية العناوين الفرعية الداخلية
    .replace(/Role\s*:/gi, '\n💼 Role:')
    .replace(/Location\s*:/gi, '\n📍 Location:')
    .replace(/Core\s*Focus\s*:/gi, '\n🎯 Core Focus:')
    .replace(/Required\s*Tech\s*Stack\s*:/gi, '\n💻 Required Tech Stack:')
    .replace(/Recommendation\s*:/gi, '\n📝 Recommendation:')

    // 6. تحويل المهارات المسبوقة بنجمه
    .replace(/\n\s*\*\s*([^*:\n]+):/g, '\n🚀 $1:')

    // 7. مسح أي علامات نجمة (*) متبقية في النص تماماً
    .replace(/\*/g, '')

    // 8. ضبط الترقيم في الـ Conclusion وإضافة أيقونة الكأس
    .replace(/Ranked\s*Candidates\s*:/gi, '\n🏆 Ranked Candidates:')
    .replace(/\n\s*\d+\.\s*\n*\s*/g, (match) => {
      const num = match.match(/\d+/)?.[0];
      return `\n${num}. `;
    })

    // 9. دمج الأسطر الفارغة الكثيرة جداً لسطر واحد فارغ كحد أقصى لمنع الفراغات العملاقة
    .replace(/\n{3,}/g, '\n\n')
    
    .trim();
};

export const ChatMessageItem: React.FC<Props> = ({ message, isStreaming }) => {
  const isUser = message.role === 'USER';
  const isAssistant = message.role === 'ASSISTANT';

  const formattedContent = useMemo(() => {
    return formatMarkdownText(message.content);
  }, [message.content]);

  return (
    <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'}`}>
      
      <div className="chat-message__avatar">
        {isUser ? (
          <span className="avatar avatar--user">You</span>
        ) : (
          <span className="avatar avatar--ai">AI</span>
        )}
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
              <ReactMarkdown>
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
    </div>
  );
};