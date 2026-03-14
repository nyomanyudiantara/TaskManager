import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import type { Task } from '../types/auth';
import { useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm'; // Ensure the path is correct

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { logout } = useContext(AuthContext)!; // Bring logout back in
  const navigate = useNavigate();


  // 1. Update filter state to accept a string (for the name)
  const [filter, setFilter] = useState<string>('all');

  // 2. Logic to get a list of unique creator names for your dropdown/buttons
  const creators = Array.from(new Set(tasks.map(t => t.creator_name)));

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks/my-tasks');
      setTasks(data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    }
  };

  const toggleStatus = async (task: Task) => {
    await api.put(`/tasks/${task.id}`, { ...task, completed: !task.completed });
    fetchTasks();
  };

  const handleLogout = () => {
    logout();           // 2. Clear token
    navigate('/login'); // 3. Redirect
  };

  // 2. Filter logic (place this before the return statement)
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    // If the filter matches a creator's name:
    return task.creator_name === filter;
  });

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1.5rem', fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '1rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>Task Dashboard</h2>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '8px 16px', 
            background: '#f44336', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </div>

      {/* Action Bar */}
      {/* Action Bar (Updated) */}
      {!showForm && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', alignItems: 'center' }}>
          <button 
            style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            onClick={() => { setShowForm(true); setIsEditing(null); }}
          >
            + Create New Task
          </button>

          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '5px' }}>
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 12px',
                  background: filter === f ? '#007bff' : '#eee',
                  color: filter === f ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Horizontal Scroll Container */}
          <div style={{   
            display: 'flex', 
            gap: '10px', 
            overflowX: 'auto', 
            paddingBottom: '10px', 
            whiteSpace: 'nowrap',
            scrollbarWidth: 'thin',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {creators.map((name) => (
              <button 
                key={name} 
                onClick={() => setFilter(name)} 
                style={{
                  padding: '6px 12px',
                  background: filter === name ? '#28a745' : '#eee',
                  color: filter === name ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  flexShrink: 0 // Prevents buttons from squishing if the list is long
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

      )}

      {/* Replace the block inside your 'else' statement with this */}
      {showForm ? (
        <TaskForm 
          task={isEditing} 
          onClose={() => setShowForm(false)} 
          onSave={fetchTasks} 
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Corrected logic: Remove the extra { here */}
          {filteredTasks.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888' }}>No {filter} tasks found.</p>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} style={{ 
                padding: '1rem', 
                background: '#fff',
                border: '1px solid #e0e0e0', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => toggleStatus(task)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                
                <div style={{ flexGrow: 1, marginLeft: '15px' }}>
                  <div style={{ fontWeight: 'bold' }}>{task.title}</div>
                  
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    Created by: <strong>{task.creator_name}</strong>
                    {task.edited_by && (
                      <span style={{ marginLeft: '10px', fontStyle: 'italic' }}>
                        | Last edited by: {task.edited_by}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => { setIsEditing(task); setShowForm(true); }}
                    style={{ background: 'none', border: '1px solid #007bff', color: '#007bff', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)} 
                    style={{ background: 'none', border: '1px solid #f44336', color: '#f44336', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
export default Dashboard;