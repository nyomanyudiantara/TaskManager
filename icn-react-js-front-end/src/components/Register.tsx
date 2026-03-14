import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', formData); // Registering the user [cite: 16]
      alert('Registration successful!');
      navigate('/login'); // Redirect to login after success
    } catch (error) {
      console.error('Registration failed', error);
      alert('Error: Could not register user.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      fontFamily: "'Archivo', sans-serif" // Ensuring the new font is active
    }}>
      <form 
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '8px', 
          color: '#333',
          fontSize: '28px'
        }}>
          Create Account
        </h2>
        <p style={{ 
          textAlign: 'center', 
          color: '#777', 
          marginBottom: '24px',
          fontSize: '14px' 
        }}>
          Join us to start managing your tasks
        </p>
        
        {/* Name Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '14px', fontWeight: '500' }}>Full Name</label>
          <input 
            type="text" 
            placeholder="John Doe" 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '16px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
        </div>

        {/* Email Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '14px', fontWeight: '500' }}>Email Address</label>
          <input 
            type="email" 
            placeholder="name@example.com" 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            required 
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '16px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '14px', fontWeight: '500' }}>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            required 
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '16px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
        </div>

        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#28a745', // Green for registration
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
        >
          Register
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ color: '#777', fontSize: '14px' }}>Already have an account? </span>
          <button 
            type="button" 
            onClick={() => navigate('/login')}
            style={{ 
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              padding: 0
            }}
          >
            Login here
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;