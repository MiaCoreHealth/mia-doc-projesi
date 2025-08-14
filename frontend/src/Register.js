// frontend/src/Register.js

import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  // Kullanıcının forma girdiği e-posta ve şifreyi saklamak için state'ler
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Backend'den gelen başarı veya hata mesajını kullanıcıya göstermek için bir state
  const [message, setMessage] = useState('');

  // Form gönderildiğinde çalışacak olan fonksiyon
  const handleSubmit = async (event) => {
    // Formun sayfayı yeniden yüklemesini engelle
    event.preventDefault();

    try {
      // axios ile backend'deki /register/ endpoint'ine POST isteği gönderiyoruz.
      // Gönderdiğimiz veri, kullanıcının girdiği email ve password'den oluşuyor.
      const response = await axios.post('http://127.0.0.1:8000/register/', {
        email: email,
        password: password
      });

      // İstek başarılı olursa, backend'den gelen mesajı alıp state'e kaydediyoruz.
      setMessage(response.data.mesaj);

    } catch (error) {
      // Eğer bir hata olursa (örn: e-posta zaten kayıtlıysa),
      // backend'in gönderdiği hata detayını yakalayıp state'e kaydediyoruz.
      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage('Kayıt sırasında bir hata oluştu.');
      }
    }
  };

  // Ekranda görünecek olan HTML (JSX) kodları
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2>Kayıt Ol</h2>
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
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Kayıt Ol
        </button>
      </form>

      {/* Mesaj varsa, bu mesajı ekranın altında göster */}
      {message && <p style={{ marginTop: '20px', textAlign: 'center' }}>{message}</p>}
    </div>
  );
}

export default Register;