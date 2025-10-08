import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from './logo.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/login.php`, { username, password });
      if (res.data.success) {
        localStorage.setItem('role', res.data.role);
        navigate('/dashboard');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="login-logo" />
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">INGRESAR</button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
