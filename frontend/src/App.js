// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import VerifyEmail from './VerifyEmail';
import Profile from './Profile';
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
  
  // ---- DÜZELTME BURADA ----
  // Bu bölüm, giriş yapmış kullanıcıların erişebileceği sayfaları koruma altına alır.
  const ProtectedRoutes = () => {
    // Eğer token yoksa, kullanıcıyı ana sayfaya (giriş ekranına) yönlendir.
    if (!token) {
      return <Navigate to="/" />;
    }
    
    // Eğer token varsa, izin verilen sayfaları göster.
    return (
      <Routes>
        <Route path="/" element={<Dashboard handleLogout={handleLogout} />} />
        <Route path="/profile" element={<Profile />} />
        {/* Giriş yapmış bir kullanıcı yanlış bir adrese giderse onu ana paneline yönlendir */}
        <Route path="*" element={<Navigate to="/" />} /> 
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
          {/* Token durumuna göre ya AuthPage'i ya da Korumalı Sayfaları göster */}
          {token ? <ProtectedRoutes /> :
            <Routes>
              <Route path="/verify-email" element={<VerifyEmail />} />
              {/* Giriş yapmamış bir kullanıcı herhangi bir adrese giderse onu giriş/kayıt ekranına yönlendir */}
              <Route path="*" element={<AuthPage />} />
            </Routes>
          }
        </main>
      </div>
    </Router>
  );
}

export default App;