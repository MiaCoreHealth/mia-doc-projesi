// frontend/src/Register.js

import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('${apiUrl}/register/', {
        email: email,
        password: password
      });
      setMessage(response.data.mesaj);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage('Kayıt sırasında bir hata oluştu.');
      }
    }
  };

  // ---- GÖRSEL DEĞİŞİKLİKLER BURADA ----
  return (
    <div className="card shadow-sm" style={{ width: '22rem' }}>
      <div className="card-body">
        <h2 className="card-title text-center mb-4">Kayıt Ol</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="registerEmail" className="form-label">E-posta Adresi</label>
            <input
              type="email"
              className="form-control"
              id="registerEmail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="registerPassword" className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control"
              id="registerPassword"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Kayıt Ol
            </button>
          </div>
        </form>
        {message && <p className="mt-3 text-center text-success">{message.includes('başarıyla') ? message : ''}</p>}
        {message && <p className="mt-3 text-center text-danger">{!message.includes('başarıyla') ? message : ''}</p>}
      </div>
    </div>
  );
}

export default Register;