import React, { useState, useEffect } from 'react';
import type { SessionResponse } from '../interfaces/chat.interfaces';

const SUGGESTIONS = [
  {
    id: 'summary',
    label: 'Quick summary of job & top candidates',
    prompt: 'Give me a quick summary of this job and the top candidates that applied.',
  },
  {
    id: 'skills',
    label: 'Top skills the candidates have',
    prompt: 'What are the top skills the candidates have for this job?',
  },
  {
    id: 'match',
    label: 'How candidates match the job',
    prompt: 'How well do the candidates match the job requirements? Rank them.',
  },
  {
    id: 'exp',
    label: 'Summarize work experience',
    prompt: "Summarize each candidate's work experience relevant to this role.",
  },
  {
    id: 'flags',
    label: 'Any red flags to watch out for?',
    prompt: 'Are there any red flags or concerns I should know about the candidates?',
  },
];

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  defaultJobId?: number;
  sessions: SessionResponse[];       // ← جديد
  onClose: () => void;
  onSubmit: (jobId: number, firstPrompt: string) => void;
}

export const NewSessionModal: React.FC<Props> = ({
  isOpen,
  isLoading,
  defaultJobId,
  sessions,
  onClose,
  onSubmit,
}) => {
  const [selectedJobId, setSelectedJobId] = useState<number | ''>('');
  const [selectedId, setSelectedId]       = useState('summary');
  const [customMode, setCustomMode]       = useState(false);
  const [customText, setCustomText]       = useState('');

  // unique jobs من الـ sessions الموجودة
  const uniqueJobs = Array.from(
    new Map(sessions.map((s) => [s.jobId, s])).values()
  ).map((s) => ({ jobId: s.jobId, title: s.title || `Job #${s.jobId}` }));

  useEffect(() => {
    if (!isOpen) return;
    setSelectedId('summary');
    setCustomMode(false);
    setCustomText('');
    setSelectedJobId(defaultJobId ?? (uniqueJobs[0]?.jobId || ''));
  }, [isOpen]);          // eslint-disable-line react-hooks/exhaustive-deps

  const resolvedPrompt = customMode
    ? customText.trim()
    : SUGGESTIONS.find((s) => s.id === selectedId)?.prompt ?? '';

  const resolvedJobId = Number(selectedJobId) || 0;

  const handleSubmit = () => {
    if (!resolvedJobId || !resolvedPrompt) return;
    onSubmit(resolvedJobId, resolvedPrompt);
  };

  if (!isOpen) return null;

  // ── حالة الـ Job ID ──────────────────────────────────────────
  const jobSection = defaultJobId ? (
    // auto من activeSession أو defaultJobId
    <div className="modal__job-badge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="14" rx="2"
          stroke="currentColor" strokeWidth="2"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <span>Job ID: {defaultJobId}</span>
      <span className="modal__job-badge-hint">auto-filled</span>
    </div>
  ) : uniqueJobs.length > 0 ? (
    // dropdown من الـ sessions
    <div className="form-field">
      <label className="form-label" htmlFor="jobSelect">Job</label>
      <select
        id="jobSelect"
        className="form-input"
        value={selectedJobId}
        onChange={(e) => setSelectedJobId(Number(e.target.value))}
      >
        {uniqueJobs.map((j) => (
          <option key={j.jobId} value={j.jobId}>
            {j.title} (ID: {j.jobId})
          </option>
        ))}
      </select>
    </div>
  ) : (
    // مفيش sessions — input عادي
    <div className="form-field">
      <label className="form-label" htmlFor="jobId">Job ID</label>
      <input
        id="jobId"
        type="number"
        className="form-input"
        placeholder="e.g. 4821"
        value={selectedJobId}
        min={1}
        onChange={(e) => setSelectedJobId(Number(e.target.value))}
      />
    </div>
  );

return (
  <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
    <div className="modal" onClick={(e) => e.stopPropagation()}>

      {/* Header */}
      <div className="modal__header">
        <div className="modal__title-group">
          <div className="modal__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="modal__title">New chat session</h2>
        </div>
        <button className="modal__close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ✅ كل المحتوى جوه modal__form */}
      <div className="modal__form">

        {/* Job section */}
        {jobSection}

        {/* Prompt suggestions */}
        <div className="form-field">
          <span className="form-label">What do you want to know?</span>
          <div className="modal__chips">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.id}
                className={`modal__chip ${selectedId === s.id && !customMode ? 'modal__chip--active' : ''}`}
                onClick={() => { setSelectedId(s.id); setCustomMode(false); }}
              >
                {s.label}
              </button>
            ))}
            <button
              className={`modal__chip modal__chip--custom ${customMode ? 'modal__chip--active' : ''}`}
              onClick={() => { setCustomMode(true); setSelectedId(''); }}
            >
              + Write my own
            </button>
          </div>
        </div>

        {/* Custom textarea */}
        {customMode && (
          <div className="form-field">
            <label className="form-label" htmlFor="customPrompt">
              Your question
              <span className="form-label__hint">{customText.length} / 5000</span>
            </label>
            <textarea
              id="customPrompt"
              autoFocus
              className="form-textarea"
              placeholder="Ask me anything about this candidate or job…"
              value={customText}
              onChange={(e) => setCustomText(e.target.value.slice(0, 5000))}
              rows={3}
            />
          </div>
        )}

        {/* Actions */}
        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={!resolvedJobId || !resolvedPrompt || isLoading}
          >
            {isLoading ? <><span className="spinner spinner--sm" /> Starting…</> : 'Start chat'}
          </button>
        </div>

      </div>{/* end modal__form */}
    </div>
  </div>
);
};