import { useState } from 'react';
import api from '../api/api';

interface TaskFormProps {
  task: Task | null;
  onClose: () => void;
  onSave: () => void;
}

const TaskForm = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [desc, setDesc] = useState(task?.description || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { 
        title, 
        description: desc, 
        // If editing, keep the existing status; if new, default to false
        completed: task ? task.completed : false 
      };

      if (task) {
        await api.put(`/tasks/${task.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  return (
  <div style={{
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e1e4e8',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '24px',
    animation: 'fadeIn 0.3s ease-in' // Smooth entrance
  }}>
    <h3 style={{ 
      marginTop: 0, 
      marginBottom: '20px', 
      fontSize: '20px', 
      color: '#1a1a1a',
      fontWeight: '600'
    }}>
      {task ? '📝 Edit Task' : '🚀 Create New Task'}
    </h3>

    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>
          Task Title
        </label>
        <input 
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid #d1d5db',
            fontSize: '16px',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#007bff'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          placeholder="What needs to be done?" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>
          Description (Optional)
        </label>
        <textarea 
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid #d1d5db',
            fontSize: '16px',
            boxSizing: 'border-box',
            minHeight: '100px',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => e.target.style.borderColor = '#007bff'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          placeholder="Add some details about this task..." 
          value={desc} 
          onChange={(e) => setDesc(e.target.value)} 
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button 
          type="button" 
          onClick={onClose}
          style={{ 
            padding: '10px 20px', 
            background: '#f3f4f6', 
            color: '#4b5563', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          style={{ 
            padding: '10px 24px', 
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(0, 123, 255, 0.2)'
          }}
        >
          {task ? 'Update Task' : 'Save Task'}
        </button>
      </div>
    </form>
  </div>
);
};

// At the bottom of TaskForm.tsx
export default TaskForm;