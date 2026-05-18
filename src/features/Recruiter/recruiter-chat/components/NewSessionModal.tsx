// ─── NewSessionModal Component ────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from 'react';

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  defaultJobId?: number;
  onClose: () => void;
  onSubmit: (jobId: number, firstPrompt: string) => void;
}

export const NewSessionModal: React.FC<Props> = ({
  isOpen,
  isLoading,
  defaultJobId,
  onClose,
  onSubmit,
}) => {
  const [jobId, setJobId] = useState('');
  const [prompt, setPrompt] = useState('');
  const firstInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setJobId(defaultJobId ? String(defaultJobId) : '');
      setPrompt('');
      setTimeout(() => (firstInputRef.current as HTMLElement | null)?.focus(), 80);
    }
  }, [isOpen, defaultJobId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = defaultJobId ?? parseInt(jobId, 10);
    if (!id || !prompt.trim()) return;
    onSubmit(id, prompt.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <div className="modal__title-group">
            <div className="modal__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="modal__title">New Chat Session</h2>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__form" noValidate>

          {/* لو الـ ID اتبعت تلقائياً — badge فقط */}
          {defaultJobId ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'var(--rc-brand-light)',
              border: '1px solid var(--rc-brand-mid)',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="7" width="20" height="14" rx="2"
                  stroke="var(--rc-brand)" strokeWidth="2"/>
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
                  stroke="var(--rc-brand)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: '13px', color: 'var(--rc-brand)', fontWeight: 600 }}>
                Job ID: {defaultJobId}
              </span>
              <span style={{
                marginLeft: 'auto',
                fontSize: '11px',
                color: 'var(--rc-text-tertiary)',
                fontFamily: 'DM Mono, monospace',
              }}>
                auto-filled
              </span>
            </div>
          ) : (
            /* لو مفيش defaultJobId — input عادي */
            <div className="form-field">
              <label className="form-label" htmlFor="jobId">Job ID</label>
              <input
                ref={(el) => { firstInputRef.current = el; }}
                id="jobId"
                type="number"
                className="form-input"
                placeholder="e.g. 4821"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                min={1}
                required
              />
            </div>
          )}

          <div className="form-field">
            <label className="form-label" htmlFor="firstPrompt">
              First Message
              <span className="form-label__hint">{prompt.length} / 5000</span>
            </label>
            <textarea
              ref={(el) => { if (defaultJobId) firstInputRef.current = el; }}
              id="firstPrompt"
              className="form-textarea"
              placeholder="What would you like to know about this candidate or job?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 5000))}
              rows={4}
              required
            />
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={(!defaultJobId && !jobId) || !prompt.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner spinner--sm" />
                  Starting…
                </>
              ) : (
                'Start Chat'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};