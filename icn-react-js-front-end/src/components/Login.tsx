import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', { email, password });
      
      // Log the entire response to see the structure
      console.log("Full Server Response:", response);
      
      if (response.data && response.data.token) {
        login(response.data.token);
        navigate('/dashboard');
      } else {
        alert('Login successful, but no token received from server.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa'
  }}>
    <form 
      onSubmit={handleLogin}
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
        marginBottom: '24px', 
        color: '#333',
        fontSize: '28px'
      }}>
        Welcome Back
      </h2>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>Email Address</label>
        <input 
          type="email" 
          placeholder="name@example.com" 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>Password</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <button 
        type="submit"
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
      >
        Sign In
      </button>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <span style={{ color: '#777', fontSize: '14px' }}>Don't have an account? </span>
        <button 
          type="button" 
          onClick={() => navigate('/register')}
          style={{ 
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'underline',
            padding: 0
          }}
        >
          Register
        </button>
      </div>
    </form>
  </div>
);
};
export default Login;