'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import TaskForm from '../../../../components/TaskForm';
import Spinner from '../../../../components/UI/Spinner';
import api from '../../../../services/api';
import { useAuth } from '../../../../hooks/useAuth';

export default function EditTask() {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user || !id) return;

    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.tasks.getById(id);
        setTask(res.data.task);
      } catch (err) {
        console.error('Failed to load task details:', err);
        setError(err.message || 'Failed to retrieve task information.');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [authLoading, user, id]);

  const handleEditSubmit = async (formData) => {
    // Call the API service to update the task
    await api.tasks.update(id, formData);
  };

  if (authLoading || !user || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '60px' }}>
      <Navbar />
      
      <main className="container animate-fade-in" style={{ marginTop: '20px' }}>
        {error ? (
          <div className="glass-panel" style={{
            padding: '32px',
            textAlign: 'center',
            background: 'var(--color-danger-bg)',
            color: '#fca5a5',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '12px' }}>⚠️</span>
            <p style={{ marginBottom: '20px' }}>{error}</p>
            <button onClick={() => router.push('/dashboard')} className="btn btn-secondary">
              Back to Dashboard
            </button>
          </div>
        ) : (
          task && (
            <TaskForm 
              initialData={{ title: task.title, description: task.description }} 
              onSubmit={handleEditSubmit} 
              isEdit={true} 
            />
          )
        )}
      </main>
    </div>
  );
}
