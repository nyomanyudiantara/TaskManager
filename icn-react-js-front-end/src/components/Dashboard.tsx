import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import { Task } from '../types/auth';
import { useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm'; // Ensure the path is correct

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { logout } = useContext(AuthContext)!; // Bring logout back in
  const navigate = useNavigate();

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
      {!showForm && (
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            style={{ 
              padding: '10px 20px', 
              background: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '1rem'
            }}
            onClick={() => { setShowForm(true); setIsEditing(null); }}
          >
            + Create New Task
          </button>
        </div>
      )}

      {showForm ? (
        <TaskForm 
          task={isEditing} 
          onClose={() => setShowForm(false)} 
          onSave={fetchTasks} 
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tasks.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888' }}>No tasks found. Start by creating one!</p>
          ) : (
            tasks.map(task => (
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
                  <div style={{ 
                    fontWeight: 'bold', 
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#888' : '#333'
                  }}>
                    {task.title}
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