// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard'; // Yeni Dashboard bileşenini içe aktarıyoruz
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('userToken'));

  useEffect(() => {
    // Token değiştiğinde localStorage'ı güncelle
    if (token) {
      localStorage.setItem('userToken', token);
    } else {
      localStorage.removeItem('userToken');
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MİA-DOC Yapay Zeka Asistanı</h1>
      </header>
      <main>
        {token ? (
          // Eğer token varsa (kullanıcı giriş yapmışsa), Dashboard'ı göster
          <Dashboard handleLogout={handleLogout} />
        ) : (
          // Eğer token yoksa, Kayıt ve Giriş formlarını göster
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
            <Register />
            <Login onLoginSuccess={setToken} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;