// frontend/src/Dashboard.js

import React, { useState } from 'react';
import axios from 'axios';
import History from './History';

function Dashboard({ handleLogout }) {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

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
    if (!token) {
      setMessage('Giriş yapılmamış veya oturum süresi dolmuş.');
      setIsLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
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

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light rounded mb-4 shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand">Analiz Paneli</span>
          <button onClick={handleLogout} className="btn btn-outline-danger">
            Çıkış Yap
          </button>
        </div>
      </nav>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Yeni Rapor Analizi</h5>
          <p className="card-text">Lütfen analiz etmek istediğiniz rapor dosyasını (.jpg, .png) seçin.</p>
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
              <h4 className="alert-heading">Yeni Analiz Sonucu:</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{analysisResult}</p>
            </div>
          )}
        </div>
      </div>
      <History key={historyKey} />
    </div>
  );
}

export default Dashboard;