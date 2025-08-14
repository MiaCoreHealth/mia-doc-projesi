// frontend/src/Dashboard.js

import React, { useState } from 'react';
import axios from 'axios';
import History from './History'; // Yeni History bileşenini içe aktarıyoruz

function Dashboard({ handleLogout }) {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // YENİ: History bileşenini yenilemek için kullanılacak bir state
  const [historyKey, setHistoryKey] = useState(0);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setAnalysisResult('');
    setMessage('');
  };

  const handleAnalyze = async () => {
    // ... (handleAnalyze fonksiyonunun başı aynı)
    if (!file) {
      setMessage('Lütfen önce bir rapor dosyası seçin.');
      return;
    }
    setIsLoading(true);
    setMessage('');
    setAnalysisResult('');
    const token = localStorage.getItem('userToken');
    if (!token) {
      setMessage('Giriş yapılmamış veya oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
      setIsLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://mia-doc-projesi.onrender.com/report/analyze/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysisResult(response.data.analysis_result);
      // YENİ: Analiz başarılı olduğunda, historyKey'i değiştirerek
      // History bileşeninin yeniden yüklenmesini tetikliyoruz.
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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>MİA-DOC Analiz Paneli</h2>
        <button onClick={handleLogout} /* ... */ >Çıkış Yap</button>
      </div>
      <p>Lütfen analiz etmek istediğiniz rapor dosyasını (.jpg, .png) seçin.</p>

      <div style={{ margin: '20px 0' }}>
        <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
        <button onClick={handleAnalyze} disabled={isLoading} /* ... */ >
          {isLoading ? 'Analiz Ediliyor...' : 'Analiz Et'}
        </button>
      </div>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      {analysisResult && (
        <div style={{ /* ... */ }}>
          <h3>Yeni Analiz Sonucu:</h3>
          <p>{analysisResult}</p>
        </div>
      )}

      {/* YENİ: History bileşenini buraya ekliyoruz */}
      <hr style={{ margin: '40px 0' }} />
      <History key={historyKey} />
    </div>
  );
}

export default Dashboard;