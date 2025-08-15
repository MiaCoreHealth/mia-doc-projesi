// frontend/src/Dashboard.js

import React, 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import History from './History';

function Dashboard({ handleLogout }) {
  const [user, setUser] = useState(null);
  // YENİ: Artık tek bir sonuç yerine, bir mesajlar dizisi tutuyoruz.
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  // E-postadan kullanıcı adını çıkaran yardımcı fonksiyon
  const getUsernameFromEmail = (email) => {
    if (!email) return '';
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };

  // Sayfa ilk yüklendiğinde kullanıcıyı çek ve karşılama mesajını ekle
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

        // Sohbeti karşılama mesajıyla başlat
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

    // Kullanıcının yüklediği dosyayı sohbet ekranına ekle
    setMessages(prev => [...prev, { sender: 'user', text: `Yüklendi: ${file.name}` }]);

    // MİA-DOC'un "düşünüyorum" mesajını ekle
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

      // Analiz sonucunu yeni bir MİA-DOC mesajı olarak ekle
      setMessages(prev => [...prev, { sender: 'mia-doc', text: response.data.analysis_result }]);
      setHistoryKey(prevKey => prevKey + 1); // Geçmişi yenile

    } catch (error) {
      const errorText = error.response ? error.response.data.detail : 'Analiz sırasında bir ağ hatası oluştu.';
      setMessages(prev => [...prev, { sender: 'mia-doc', text: `Bir hata oluştu: ${errorText}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Dosya seçildiğinde handleAnalyze'ı doğrudan çağıran fonksiyon
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
          <button onClick={handleLogout} className="btn btn-outline-danger">Çıkış Yap</button>
        </div>
      </nav>

      {/* Sohbet Mesajları Alanı */}
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

      {/* Dosya Yükleme Alanı */}
      <div className="input-group">
        <input type="file" className="form-control" accept="image/png, image/jpeg" onChange={handleFileChange} disabled={isLoading} />
        <label className="input-group-text">Rapor Yükle</label>
      </div>

      <History key={historyKey} />
    </div>
  );
}

export default Dashboard;