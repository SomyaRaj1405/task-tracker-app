'use client';

import React from 'react';
import Navbar from '../../../components/Navbar';
import TaskForm from '../../../components/TaskForm';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';
import Spinner from '../../../components/UI/Spinner';

export default function NewTask() {
  const { user, loading } = useAuth();

  const handleCreateSubmit = async (formData) => {
    // Call the API service to create a task
    await api.tasks.create(formData.title, formData.description);
  };

  if (loading || !user) {
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
        <TaskForm onSubmit={handleCreateSubmit} isEdit={false} />
      </main>
    </div>
  );
}
