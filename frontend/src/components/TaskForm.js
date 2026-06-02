'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from './UI/Spinner';
import { useToast } from './UI/Toast';
import { parseTaskText } from './TaskCard';
import { 
  CalendarIcon, 
  FlagIcon, 
  HashIcon,
  InfoIcon
} from './UI/Icons';

export default function TaskForm({ initialData = {}, onSubmit, isEdit = false }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const router = useRouter();
  const { showToast } = useToast();

  // Run the dynamic parser live in-render
  const parsed = parseTaskText(title, description);
  const hasParsedMetadata = parsed.tags.length > 0 || parsed.priority || parsed.dueDateLabel;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSubmitError('');

    if (!title || !title.trim()) {
      setValidationError('Task title is required.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim()
      });
      showToast(isEdit ? 'Task updated successfully' : 'Task created successfully', 'success');
      router.push('/dashboard');
    } catch (err) {
      setSubmitError(err.message || 'Failed to save task. Please try again.');
      showToast(err.message || 'Failed to save task', 'error');
      setSubmitting(false);
    }
  };

  // Get color styles for the preview flags
  const getPriorityColor = (prio) => {
    if (prio === 'high') return '#ef4444';
    if (prio === 'medium') return '#f59e0b';
    if (prio === 'low') return '#3b82f6';
    return 'currentColor';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '640px', margin: '0 auto' }}>
      <form onSubmit={handleFormSubmit} className="card-panel" style={{ padding: '24px 28px' }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          marginBottom: '20px',
          color: 'var(--text-primary)'
        }}>
          {isEdit ? 'Edit Task Details' : 'Create New Project Task'}
        </h2>

        {/* Validation Errors */}
        {validationError && (
          <div style={{
            background: 'var(--color-danger-bg)',
            color: '#fca5a5',
            border: '1px solid var(--color-danger-border)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            marginBottom: '16px'
          }}>
            {validationError}
          </div>
        )}

        {/* Network Errors */}
        {submitError && (
          <div style={{
            background: 'var(--color-danger-bg)',
            color: '#fca5a5',
            border: '1px solid var(--color-danger-border)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            marginBottom: '16px'
          }}>
            {submitError}
          </div>
        )}

        {/* Title Field */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">Task Title</label>
          <input 
            id="title"
            type="text"
            className="form-control"
            placeholder="e.g. Wireframe layout sketches"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            maxLength={100}
            autoFocus
          />
        </div>

        {/* Description Field */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label htmlFor="description" className="form-label">Description (Optional)</label>
          <textarea 
            id="description"
            className="form-control"
            placeholder="e.g. Draft landing wireframes for client sign-off..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
            rows={4}
            maxLength={500}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Informative tips box about custom parsing syntax */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed var(--border-color)',
          borderRadius: '8px',
          padding: '12px 14px',
          marginBottom: '24px',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start'
        }}>
          <InfoIcon size={16} color="var(--color-primary)" style={{ marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
              💡 Smart Task Shortcuts
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Type tags like <code style={{color: 'var(--color-primary)'}}>#marketing</code>, priority like <code style={{color: 'var(--color-primary)'}}>!high</code>, or dates like <code style={{color: 'var(--color-primary)'}}>@tomorrow</code> / <code style={{color: 'var(--color-primary)'}}>@2026-06-15</code> directly into the fields to auto-categorize.
            </p>
          </div>
        </div>

        {/* Form Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '20px'
        }}>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            disabled={submitting}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ minWidth: '110px', padding: '8px 16px', fontSize: '0.85rem' }}
          >
            {submitting ? <Spinner size="sm" color="white" /> : (isEdit ? 'Save Changes' : 'Create Task')}
          </button>
        </div>
      </form>

      {/* Live Preview Panel Card */}
      {(title.trim() || description.trim()) && (
        <div className="animate-fade-in">
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-secondary)',
            marginBottom: '8px',
            marginLeft: '4px'
          }}>
            Live Task Preview
          </p>
          <div 
            className="card-panel" 
            style={{
              padding: '16px 20px',
              background: 'rgba(255, 255, 255, 0.01)',
              borderColor: 'var(--border-color)',
              opacity: 0.85
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '1px solid var(--border-hover)',
                marginTop: '2px',
                flexShrink: 0
              }} />
              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                {parsed.cleanTitle || <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontStyle: 'italic' }}>Task Title Preview</span>}
              </h4>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '26px', marginBottom: '14px', wordBreak: 'break-all' }}>
              {parsed.cleanDescription || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Description Preview</span>}
            </p>

            {hasParsedMetadata && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginLeft: '26px' }}>
                {parsed.priority && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: getPriorityColor(parsed.priority),
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    <FlagIcon size={9} color={getPriorityColor(parsed.priority)} />
                    {parsed.priority}
                  </span>
                )}

                {parsed.dueDateLabel && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)',
                    padding: '2px 5px',
                    borderRadius: '4px'
                  }}>
                    <CalendarIcon size={9} />
                    {parsed.dueDateLabel}
                  </span>
                )}

                {parsed.tags.map(tag => (
                  <span key={tag} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    color: 'var(--color-primary)',
                    background: 'rgba(99, 102, 241, 0.04)',
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                    padding: '2px 5px',
                    borderRadius: '4px'
                  }}>
                    <HashIcon size={9} color="var(--color-primary)" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
