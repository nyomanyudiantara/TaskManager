import { useContext } from 'react'; // Add this
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Add Navigate
import { AuthProvider, AuthContext } from './context/AuthContext'; // Import AuthContext too
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';

function App() {
  // We move the redirect logic inside the component where AuthContext is available
  const RootRedirect = () => {
    const auth = useContext(AuthContext);
    // If auth is null or token is missing, go to login
    return auth?.token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
  };
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;