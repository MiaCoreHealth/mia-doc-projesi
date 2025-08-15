// frontend/src/Login.js

import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    try {
      const response = await axios.post(`${apiUrl}/token', params);
      localStorage.setItem('userToken', response.data.access_token);
      onLoginSuccess(response.data.access_token);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage('Giriş sırasında bir hata oluştu.');
      }
    }
  };

  // ---- GÖRSEL DEĞİŞİKLİKLER BURADA ----
  return (
    <div className="card shadow-sm" style={{ width: '22rem' }}>
      <div className="card-body">
        <h2 className="card-title text-center mb-4">Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="loginEmail" className="form-label">E-posta Adresi</label>
            <input
              type="email"
              className="form-control"
              id="loginEmail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="loginPassword" className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control"
              id="loginPassword"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-success">
              Giriş Yap
            </button>
          </div>
        </form>
        {message && <p className="mt-3 text-center text-danger">{message}</p>}
      </div>
    </div>
  );
}

export default Login;