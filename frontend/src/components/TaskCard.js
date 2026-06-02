'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from './UI/Toast';
import { 
  EditIcon, 
  TrashIcon, 
  CheckIcon, 
  CalendarIcon, 
  FlagIcon,
  HashIcon
} from './UI/Icons';

// String parser helper
export function parseTaskText(title = '', description = '') {
  const combined = `${title} ${description}`;
  
  // 1. Extract hashtags
  const tagRegex = /#([\w-]+)/g;
  const tags = [];
  let tagMatch;
  while ((tagMatch = tagRegex.exec(combined)) !== null) {
    const tag = tagMatch[1].toLowerCase();
    if (!tags.includes(tag)) {
      tags.push(tag);
    }
  }

  // 2. Extract priority
  const priorityRegex = /!(high|medium|low|med|urgent|1|2|3)\b/i;
  const prioMatch = combined.match(priorityRegex);
  let priority = null;
  if (prioMatch) {
    const val = prioMatch[1].toLowerCase();
    if (['high', 'urgent', '1'].includes(val)) priority = 'high';
    else if (['medium', 'med', '2'].includes(val)) priority = 'medium';
    else if (['low', '3'].includes(val)) priority = 'low';
  }

  // 3. Extract due date
  const dateRegex = /@(today|tomorrow|\d{4}-\d{2}-\d{2})/i;
  const dateMatch = combined.match(dateRegex);
  let dueDate = null;
  let dueDateLabel = null;
  let isOverdue = false;

  if (dateMatch) {
    const rawDate = dateMatch[1].toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (rawDate === 'today') {
      dueDate = today.toISOString().split('T')[0];
      dueDateLabel = 'Today';
    } else if (rawDate === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDate = tomorrow.toISOString().split('T')[0];
      dueDateLabel = 'Tomorrow';
    } else {
      dueDate = dateMatch[1];
      const parsedDate = new Date(dueDate);
      parsedDate.setHours(0, 0, 0, 0);
      
      dueDateLabel = parsedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (parsedDate < today) {
        isOverdue = true;
      }
    }
  }

  // Clean title and description strings by removing markers
  const cleanTitle = title
    .replace(/#([\w-]+)/g, '')
    .replace(/!(high|medium|low|med|urgent|1|2|3)\b/gi, '')
    .replace(/@(today|tomorrow|\d{4}-\d{2}-\d{2})/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  const cleanDescription = description
    .replace(/#([\w-]+)/g, '')
    .replace(/!(high|medium|low|med|urgent|1|2|3)\b/gi, '')
    .replace(/@(today|tomorrow|\d{4}-\d{2}-\d{2})/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    cleanTitle: cleanTitle || title,
    cleanDescription: cleanDescription || description,
    tags,
    priority,
    dueDate,
    dueDateLabel,
    isOverdue
  };
}

export default function TaskCard({ task, onStatusToggle, onDelete }) {
  const { showToast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Parse title and description
  const { 
    cleanTitle, 
    cleanDescription, 
    tags, 
    priority, 
    dueDateLabel, 
    isOverdue 
  } = parseTaskText(task.title, task.description);

  const handleToggle = async () => {
    setToggling(true);
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await onStatusToggle(task.id, nextStatus);
      showToast(
        nextStatus === 'completed' ? 'Task marked as completed' : 'Task marked as pending', 
        nextStatus === 'completed' ? 'success' : 'info'
      );
    } catch (err) {
      showToast('Failed to update task status', 'error');
    } finally {
      setToggling(false);
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setDeleting(true);
      try {
        await onDelete(task.id);
        showToast('Task deleted successfully', 'success');
      } catch (err) {
        showToast('Failed to delete task', 'error');
        setDeleting(false);
      }
    }
  };

  const isCompleted = task.status === 'completed';

  // Get color depending on priority
  const getPriorityColor = (prio) => {
    if (prio === 'high') return 'var(--color-danger)';
    if (prio === 'medium') return 'var(--color-pending)';
    if (prio === 'low') return '#3b82f6';
    return '#808080'; // gray default
  };

  const prioColor = getPriorityColor(priority);

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '12px 8px',
        borderBottom: '1px solid var(--border-color)',
        background: isCompleted ? 'rgba(46, 125, 50, 0.005)' : 'transparent',
        opacity: isCompleted ? 0.7 : 1,
        transition: 'var(--transition-smooth)',
        gap: '12px'
      }}
    >
      {/* Left side: Checklist Checkbox & Title/Desc details */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
        
        {/* Checklist button matching priority boundary colors */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            border: isCompleted 
              ? `1px solid var(--color-success)` 
              : `1px solid ${prioColor}`,
            background: isCompleted 
              ? 'var(--color-success)' 
              : hovered ? 'rgba(222, 76, 58, 0.05)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            marginTop: '3px',
            flexShrink: 0,
            transition: 'var(--transition-smooth)'
          }}
          title={isCompleted ? "Mark as pending" : "Mark as completed"}
        >
          {isCompleted ? (
            <CheckIcon size={11} color="#ffffff" strokeWidth={3.5} />
          ) : (
            hovered && <CheckIcon size={10} color={prioColor} strokeWidth={3} />
          )}
        </button>

        {/* Text workspace */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <h4 style={{
              fontSize: '0.88rem',
              fontWeight: 500,
              color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: isCompleted ? 'line-through' : 'none',
              lineHeight: 1.35,
              wordBreak: 'break-word'
            }}>
              {cleanTitle}
            </h4>
          </div>

          {/* Description */}
          {cleanDescription && (
            <p style={{
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              marginTop: '3px',
              marginBottom: '6px',
              lineHeight: 1.4,
              whiteSpace: 'pre-line',
              wordBreak: 'break-word'
            }}>
              {cleanDescription}
            </p>
          )}

          {/* Metadata badges row */}
          {(tags.length > 0 || priority || dueDateLabel) && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginTop: '4px'
            }}>
              {/* Priority flag */}
              {priority && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: prioColor,
                  background: priority === 'high' ? 'var(--color-danger-bg)' : 'rgba(255,255,255,0.02)',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  textTransform: 'lowercase'
                }}>
                  <FlagIcon size={10} color={prioColor} />
                  {priority}
                </span>
              )}

              {/* Due Date */}
              {dueDateLabel && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '0.68rem',
                  fontWeight: 500,
                  color: (isOverdue && !isCompleted) ? 'var(--color-danger)' : 'var(--text-secondary)',
                  background: (isOverdue && !isCompleted) ? 'var(--color-danger-bg)' : '#f1efed',
                  padding: '2px 4px',
                  borderRadius: '3px'
                }}>
                  <CalendarIcon size={10} color={(isOverdue && !isCompleted) ? 'var(--color-danger)' : 'var(--text-secondary)'} />
                  {dueDateLabel}
                </span>
              )}

              {/* Tags */}
              {tags.map(tag => (
                <span key={tag} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontSize: '0.68rem',
                  fontWeight: 500,
                  color: 'var(--color-primary)',
                  background: 'rgba(222, 76, 58, 0.05)',
                  padding: '2px 4px',
                  borderRadius: '3px'
                }}>
                  <HashIcon size={8} color="var(--color-primary)" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Action controls - fade in on hover on desktop */}
      <div style={{
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
        opacity: hovered ? 1 : 0.2,
        transition: 'var(--transition-smooth)',
        flexShrink: 0
      }}>
        {/* Edit */}
        <Link
          href={`/tasks/${task.id}/edit`}
          style={{
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f1efed'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          title="Edit task"
        >
          <EditIcon size={14} color="var(--text-secondary)" />
        </Link>

        {/* Delete */}
        <button
          onClick={handleDeleteClick}
          disabled={deleting}
          style={{
            padding: '4px',
            border: 'none',
            background: 'none',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-danger)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-danger-bg)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          title="Delete task"
        >
          <TrashIcon size={14} color="var(--color-danger)" />
        </button>
      </div>
    </div>
  );
}
