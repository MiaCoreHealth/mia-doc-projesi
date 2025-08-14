// frontend/src/Login.js
import React, { useState } from 'react';
import axios from 'axios';

// onLoginSuccess prop'u, App.js'e girişin başarılı olduğunu bildirmek için kullanılacak.
function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Backend'in /token endpoint'i x-www-form-urlencoded formatında veri bekler.
    // Bu yüzden veriyi bu formata çeviriyoruz.
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    try {
      const response = await axios.post('http://127.0.0.1:8000/token', params);

      // Giriş başarılıysa, backend'den gelen token'ı (giriş kartını)
      // tarayıcının yerel hafızasına (localStorage) kaydediyoruz.
      // Bu sayede kullanıcı sayfayı yenilese bile giriş bilgisi kaybolmaz.
      localStorage.setItem('userToken', response.data.access_token);

      setMessage('Giriş başarılı! Yönlendiriliyorsunuz...');
      // App.js'e haber veriyoruz.
      onLoginSuccess(response.data.access_token);

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage('Giriş sırasında bir hata oluştu.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2>Giriş Yap</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>E-posta Adresi</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Şifre</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
          Giriş Yap
        </button>
      </form>
      {message && <p style={{ marginTop: '20px', textAlign: 'center' }}>{message}</p>}
    </div>
  );
}

export default Login;