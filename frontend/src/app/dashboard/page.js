'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import DashboardStats from '../../components/DashboardStats';
import TaskCard, { parseTaskText } from '../../components/TaskCard';
import Spinner from '../../components/UI/Spinner';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/UI/Toast';
import { 
  SearchIcon, 
  PlusIcon, 
  CalendarIcon, 
  ClockIcon, 
  CheckIcon, 
  HashIcon 
} from '../../components/UI/Icons';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await api.tasks.getStats();
      setStats(res.data.stats);
    } catch (err) {
      console.error('Failed to retrieve task stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Task Listings
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.tasks.getAll(statusFilter, searchQuery);
      setTasks(res.data.tasks);
    } catch (err) {
      setError('Could not retrieve tasks. Please try again.');
      showToast('Could not retrieve tasks', 'error');
      console.error('Failed to list tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, showToast]);

  // Synchronize dashboard on mount and query updates
  useEffect(() => {
    if (authLoading || !user) return;
    fetchTasks();
    fetchStats();
  }, [authLoading, user, fetchTasks, fetchStats]);

  // Handle task completion toggle
  const handleStatusToggle = async (taskId, nextStatus) => {
    try {
      await api.tasks.update(taskId, { status: nextStatus });
      
      // Update local task state immediately for instant UX feedback
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? { ...t, status: nextStatus } : t)
      );

      // Re-trigger stats aggregate reload
      fetchStats();
    } catch (err) {
      showToast('Failed to update task status', 'error');
      console.error(err);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    try {
      await api.tasks.delete(taskId);
      
      // Remove from local tasks list state
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      
      // Refresh dashboard counters
      fetchStats();
    } catch (err) {
      showToast('Failed to delete task', 'error');
      console.error(err);
    }
  };

  // Extract all unique tags dynamically from currently fetched tasks
  const dynamicTags = useMemo(() => {
    const tagsSet = new Set();
    tasks.forEach(task => {
      const { tags } = parseTaskText(task.title, task.description);
      tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [tasks]);

  // Filter tasks locally by tag if selected
  const displayedTasks = useMemo(() => {
    if (!selectedTag) return tasks;
    return tasks.filter(task => {
      const { tags } = parseTaskText(task.title, task.description);
      return tags.includes(selectedTag);
    });
  }, [tasks, selectedTag]);

  // Handler when sidebar status tabs are clicked (resets selected tag filter)
  const handleStatusTabClick = (status) => {
    setStatusFilter(status);
    setSelectedTag(null);
  };

  // Handler when a tag is clicked in the sidebar
  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    if (statusFilter !== 'all') {
      setStatusFilter('all');
    }
  };

  // Get dynamic name of current active view for main panel header
  const getActiveViewName = () => {
    if (selectedTag) return `Tag: #${selectedTag}`;
    if (statusFilter === 'pending') return 'Inbox (Pending)';
    if (statusFilter === 'completed') return 'Completed Tasks';
    return 'All Project Tasks';
  };

  if (authLoading || !user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '60px' }}>
      <Navbar />
      
      <main className="container animate-fade-in" style={{ marginTop: '24px' }}>
        
        {/* Workspace Title Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {getActiveViewName()}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              Manage and organize your tasks using Todoist-inspired shortcuts.
            </p>
          </div>
          
          <Link href="/tasks/new" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            <PlusIcon size={14} color="#ffffff" />
            Add Task
          </Link>
        </div>

        {/* Dynamic two-column dashboard layout */}
        <div className="dashboard-layout">
          
          {/* Column 1: Sidebar Nav Panel */}
          <aside className="sidebar-panel">
            {/* Views Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', paddingLeft: '10px' }}>
                Workspace
              </p>
              <nav className="sidebar-nav">
                <button 
                  onClick={() => handleStatusTabClick('all')} 
                  className={`sidebar-link ${statusFilter === 'all' && !selectedTag ? 'active' : ''}`}
                >
                  <CalendarIcon size={14} color={statusFilter === 'all' && !selectedTag ? 'var(--color-primary)' : 'var(--text-secondary)'} />
                  All Tasks
                </button>
                <button 
                  onClick={() => handleStatusTabClick('pending')} 
                  className={`sidebar-link ${statusFilter === 'pending' && !selectedTag ? 'active' : ''}`}
                >
                  <ClockIcon size={14} color={statusFilter === 'pending' && !selectedTag ? 'var(--color-primary)' : '#b78103'} />
                  Inbox
                </button>
                <button 
                  onClick={() => handleStatusTabClick('completed')} 
                  className={`sidebar-link ${statusFilter === 'completed' && !selectedTag ? 'active' : ''}`}
                >
                  <CheckIcon size={14} color={statusFilter === 'completed' && !selectedTag ? 'var(--color-primary)' : 'var(--color-success)'} />
                  Completed
                </button>
              </nav>
            </div>

            {/* Dynamic Tags Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', paddingLeft: '10px' }}>
                Tags & Labels
              </p>
              {dynamicTags.length > 0 ? (
                <nav className="sidebar-nav">
                  {dynamicTags.map(tag => (
                    <button 
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`sidebar-link ${selectedTag === tag ? 'active' : ''}`}
                      style={{ textTransform: 'lowercase' }}
                    >
                      <HashIcon size={12} color={selectedTag === tag ? 'var(--color-primary)' : 'var(--color-secondary)'} />
                      {tag}
                    </button>
                  ))}
                </nav>
              ) : (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '10px', fontStyle: 'italic' }}>
                  No tags in tasks.
                </p>
              )}
            </div>
          </aside>

          {/* Column 2: Stats, Search controls, and Task List Grid */}
          <div className="content-panel">
            
            {/* Dashboard metrics stats */}
            <DashboardStats stats={stats} loading={statsLoading} />

            {/* Controls Layout Panel: Search Bar */}
            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              marginBottom: '16px',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', left: '10px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <SearchIcon size={14} color="var(--text-secondary)" />
              </div>
              <input 
                type="text"
                className="form-control"
                placeholder="Quick search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '32px', paddingRight: '12px' }}
              />

              {/* Show active tag indicator that can be cleared */}
              {selectedTag && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ffefe5',
                  border: '1px solid rgba(222, 76, 58, 0.2)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  color: 'var(--color-primary)',
                  whiteSpace: 'nowrap'
                }}>
                  <span>#{selectedTag}</span>
                  <button 
                    onClick={() => setSelectedTag(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-primary)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Task Grid & List Panel */}
            {error && (
              <div style={{
                background: 'var(--color-danger-bg)',
                color: 'var(--color-danger)',
                border: '1px solid var(--color-danger-border)',
                padding: '10px 12px',
                borderRadius: '6px',
                textAlign: 'center',
                marginBottom: '16px',
                fontSize: '0.82rem'
              }}>
                {error}
              </div>
            )}

            {loading ? (
              // List loading skeletons
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px'
              }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton" style={{ height: '52px', borderRadius: '6px' }} />
                ))}
              </div>
            ) : displayedTasks.length > 0 ? (
              // List container layout
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '4px 12px 12px 12px',
                boxShadow: 'var(--shadow-premium)'
              }}>
                {displayedTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusToggle={handleStatusToggle}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            ) : (
              // Empty State Layout
              <div className="card-panel" style={{
                padding: '36px 20px',
                textAlign: 'center',
                background: '#ffffff'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--bg-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                  color: 'var(--text-secondary)'
                }}>
                  <ClockIcon size={18} />
                </div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>
                  No tasks found
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '16px', maxWidth: '320px', margin: '0 auto 16px auto', lineHeight: 1.4 }}>
                  {searchQuery || selectedTag || statusFilter !== 'all' 
                    ? 'No tasks match your current filters or searches.'
                    : "You don't have any tasks created yet. Write your first task to start organizing."}
                </p>
                {!searchQuery && !selectedTag && statusFilter === 'all' && (
                  <Link href="/tasks/new" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    <PlusIcon size={14} color="#ffffff" />
                    Add a Task
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
