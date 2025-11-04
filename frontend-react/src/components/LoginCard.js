// frontend-react/src/components/LoginCard.js
import React, { useState } from 'react';
import '../App.css';

const API_BASE_URL = 'http://localhost:5000/api';

const LoginCard = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      localStorage.setItem('token', data.token);
      onLogin(data.user);
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginCard;
