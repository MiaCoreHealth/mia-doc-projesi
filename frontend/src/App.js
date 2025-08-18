// frontend/src/App.js

import React, { useState, useEffect } from 'react';
// YENİ: Yönlendirme için gerekli bileşenleri import ediyoruz
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import VerifyEmail from './VerifyEmail'; // Yeni sayfamızı import ediyoruz
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('userToken'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('userToken', token);
    } else {
      localStorage.removeItem('userToken');
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
  };

  // Ana giriş/kayıt sayfasını bir bileşen haline getiriyoruz
  const AuthPage = () => (
    <div className="row justify-content-center g-4">
      <div className="col-auto"><Register /></div>
      <div className="col-auto"><Login onLoginSuccess={setToken} /></div>
    </div>
  );

  return (
    <Router>
      <div className="container mt-4">
        <header className="text-center mb-4">
          <h1>MİA-DOC Yapay Zeka Asistanı</h1>
        </header>
        <main>
          <Routes>
            {/* Ana URL (`/`) için: Kullanıcı giriş yapmışsa Dashboard'ı, yapmamışsa AuthPage'i göster */}
            <Route path="/" element={token ? <Dashboard handleLogout={handleLogout} /> : <AuthPage />} />

            {/* `/verify-email` URL'i için: VerifyEmail sayfasını göster */}
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;