// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import VerifyEmail from './VerifyEmail';
import Profile from './Profile'; // YENİ: Profile sayfasını import ediyoruz
import './App.css';

function App() {
  // ... (useState, useEffect, handleLogout fonksiyonları aynı)
  const [token, setToken] = useState(localStorage.getItem('userToken'));
  useEffect(() => {
    if (token) { localStorage.setItem('userToken', token); } 
    else { localStorage.removeItem('userToken'); }
  }, [token]);
  const handleLogout = () => { setToken(null); };

  const AuthPage = () => ( /* ... AuthPage aynı ... */ );

  // YENİ: Giriş yapmış kullanıcılar için özel sayfa düzeni
  const ProtectedLayout = () => {
    // Eğer token yoksa (örn: linke doğrudan girmeye çalışırsa), ana sayfaya yönlendir
    if (!token) {
      return <AuthPage />;
    }
    return (
      <Routes>
        <Route path="/" element={<Dashboard handleLogout={handleLogout} />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    );
  };

  return (
    <Router>
      <div className="container mt-4">
        <header className="text-center mb-4">
          <h1>MİA-DOC Yapay Zeka Asistanı</h1>
        </header>
        <main>
          {/* Token durumuna göre ya AuthPage'i ya da korumalı sayfaları göster */}
          {token ? <ProtectedLayout /> : 
            <Routes>
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="*" element={<AuthPage />} />
            </Routes>
          }
        </main>
      </div>
    </Router>
  );
}

export default App;