// frontend/src/Dashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import History from './History';

function Dashboard({ handleLogout }) {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  const getUsernameFromEmail = (email) => {
    if (!email) return '';
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };
  
  useEffect(() => {
    const fetchUserAndWelcome = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) { handleLogout(); return; }
      
      const apiUrl = process.env.REACT_APP_API_URL;
      try {
        const response = await axios.get(`${apiUrl}/users/me/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const fetchedUser = response.data;
        setUser(fetchedUser);

        setMessages([
          {
            sender: 'mia-doc',
            text: `Merhaba ${getUsernameFromEmail(fetchedUser.email)}, ben MİA-DOC. Analiz etmemi istediğin tıbbi raporunu (.jpg, .png) lütfen aşağıdan seç.`
          }
        ]);
      } catch (error) {
        console.error("Kullanıcı bilgisi alınamadı:", error);
        handleLogout();
      }
    };

    fetchUserAndWelcome();
  }, [handleLogout]);

  const handleAnalyze = async (file) => {
    if (!file) return;
    setIsLoading(true);
    const token = localStorage.getItem('userToken');
    const apiUrl = process.env.REACT_APP_API_URL;

    setMessages(prev => [...prev, { sender: 'user', text: `Yüklendi: ${file.name}` }]);
    setMessages(prev => [...prev, { sender: 'mia-doc', text: 'Raporunu aldım, inceliyorum...' }]);

    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(`${apiUrl}/report/analyze/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setMessages(prev => [...prev, { sender: 'mia-doc', text: response.data.analysis_result }]);
      setHistoryKey(prevKey => prevKey + 1);

    } catch (error) {
      const errorText = error.response ? error.response.data.detail : 'Analiz sırasında bir ağ hatası oluştu.';
      setMessages(prev => [...prev, { sender: 'mia-doc', text: `Bir hata oluştu: ${errorText}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleAnalyze(file);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-light bg-light rounded mb-4 shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand">
            {user ? `${getUsernameFromEmail(user.email)} & MİA-DOC` : 'Yükleniyor...'}
          </span>
          <div>
            <Link to="/profile" className="btn btn-outline-secondary me-2">Profilim</Link>
            <button onClick={handleLogout} className="btn btn-outline-danger">Çıkış Yap</button>
          </div>
        </div>
      </nav>
      <div className="chat-window card shadow-sm mb-3">
        <div className="card-body">
          {messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && (
             <div className="message-bubble mia-doc">
               <span className="spinner-border spinner-border-sm"></span> Düşünüyorum...
             </div>
          )}
        </div>
      </div>
      <div className="input-group">
        <input type="file" className="form-control" accept="image/png, image/jpeg" onChange={handleFileChange} disabled={isLoading} id="fileInput"/>
        <label className="input-group-text" htmlFor="fileInput">Rapor Yüklendi</label>
      </div>
      <History key={historyKey} />
    </div>
  );
}

export default Dashboard;