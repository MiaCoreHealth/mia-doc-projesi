// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
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

  return (
    // Bootstrap container sınıfı ile içeriği ortalayıp kenarlara boşluk ekliyoruz
    <div className="container mt-4"> 
      <header className="text-center mb-4">
        <h1>MİA-DOC Yapay Zeka Asistanı</h1>
      </header>
      <main>
        {token ? (
          <Dashboard handleLogout={handleLogout} />
        ) : (
          <div className="row justify-content-center g-4">
            <div className="col-auto">
              <Register />
            </div>
            <div className="col-auto">
              <Login onLoginSuccess={setToken} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;