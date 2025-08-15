// frontend/src/Dashboard.js

// useEffect'i react'tan import etmeyi unutmuyoruz
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import History from './History';

function Dashboard({ handleLogout }) {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  // YENİ: Kullanıcı bilgisini saklamak için bir state
  const [user, setUser] = useState(null);

  // YENİ: Bu bölüm, Dashboard sayfası ilk yüklendiğinde SADECE BİR KEZ çalışır.
  useEffect(() => {
    // Kullanıcının kim olduğunu öğrenmek için bir fonksiyon tanımlıyoruz
    const fetchUser = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        // Token yoksa bir şey yapma, App.js zaten bizi giriş ekranına yönlendirir
        return;
      }
      
      const apiUrl = process.env.REACT_APP_API_URL;
      try {
        // Backend'deki yeni /users/me/ endpoint'ine istek gönderiyoruz
        const response = await axios.get(`${apiUrl}/users/me/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Gelen kullanıcı verisini state'e kaydediyoruz
        setUser(response.data);
      } catch (error) {
        console.error("Kullanıcı bilgisi alınamadı:", error);
        // Hata olursa (örn: token süresi dolmuşsa) otomatik çıkış yap
        handleLogout();
      }
    };

    fetchUser();
  }, [handleLogout]); // handleLogout değişmediği sürece tekrar çalışmaz


  // --- Diğer Fonksiyonlar (handleFileChange, handleAnalyze) aynı, değişiklik yok ---
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setAnalysisResult('');
    setMessage('');
  };
  const handleAnalyze = async () => {
    if (!file) {
      setMessage('Lütfen önce bir rapor dosyası seçin.');
      return;
    }
    setIsLoading(true);
    setMessage('');
    setAnalysisResult('');
    const token = localStorage.getItem('userToken');
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${apiUrl}/report/analyze/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setAnalysisResult(response.data.analysis_result);
      setHistoryKey(prevKey => prevKey + 1);
    } catch (error) {
      if (error.response) {
        setMessage(`Hata: ${error.response.data.detail}`);
      } else {
        setMessage('Analiz sırasında bir ağ hatası oluştu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // E-postadan kullanıcı adını çıkaran basit bir yardımcı fonksiyon
  const getUsernameFromEmail = (email) => {
    if (!email) return '';
    const namePart = email.split('@')[0];
    // İsmin ilk harfini büyük yap
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };

  // ---- GÖRSEL DEĞİŞİKLİKLER BURADA ----
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light rounded mb-4 shadow-sm">
        <div className="container-fluid">
          {/* Kullanıcı bilgisi yüklendiğinde kişisel bir mesaj göster */}
          <span className="navbar-brand">
            {user ? `Merhaba ${getUsernameFromEmail(user.email)}!` : 'Analiz Paneli'}
          </span>
          <button onClick={handleLogout} className="btn btn-outline-danger">
            Çıkış Yap
          </button>
        </div>
      </nav>

      {/* Kullanıcı bilgisi yüklenene kadar bir yükleniyor mesajı göster */}
      {!user ? (
        <p>Kullanıcı bilgileri yükleniyor...</p>
      ) : (
        <>
          {/* Sohbet başlangıç mesajı */}
          <div className="alert alert-info">
            Ben MİA-DOC. Bugün sana nasıl yardımcı olabilirim? Lütfen analiz etmek istediğin raporu aşağıdan seç.
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Yeni Rapor Analizi</h5>
              <div className="input-group">
                <input type="file" className="form-control" accept="image/png, image/jpeg" onChange={handleFileChange} />
                <button onClick={handleAnalyze} disabled={isLoading} className="btn btn-primary">
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span className="ms-2">Analiz Ediliyor...</span>
                    </>
                  ) : 'Analiz Et'}
                </button>
              </div>

              {message && <div className="alert alert-danger mt-3">{message}</div>}
              
              {analysisResult && (
                <div className="alert alert-success mt-3">
                  <h4 className="alert-heading">MİA-DOC Yorumu:</h4>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{analysisResult}</p>
                </div>
              )}
            </div>
          </div>
          
          <History key={historyKey} />
        </>
      )}
    </div>
  );
}

export default Dashboard;