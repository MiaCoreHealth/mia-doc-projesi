// frontend/src/VerifyEmail.js

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Hesabınız doğrulanıyor, lütfen bekleyin...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setMessage('Doğrulama linki geçersiz veya eksik.');
      return;
    }

    const verifyToken = async () => {
      const apiUrl = process.env.REACT_APP_API_URL;
      try {
        // Backend'deki /verify-email/ endpoint'ine token ile istek gönderiyoruz
        await axios.get(`${apiUrl}/verify-email/`, {
          params: { token: token }
        });
        setMessage('Hesabınız başarıyla doğrulandı! Artık giriş yapabilirsiniz.');
      } catch (error) {
        const errorMsg = error.response ? error.response.data.detail : 'Bilinmeyen bir hata oluştu.';
        setMessage(`Doğrulama başarısız: ${errorMsg}`);
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="container text-center mt-5">
      <div className="card shadow-sm" style={{ maxWidth: '500px', margin: 'auto' }}>
        <div className="card-body">
          <h2 className="card-title">Hesap Doğrulama</h2>
          <p className="lead">{message}</p>
          <Link to="/" className="btn btn-primary mt-3">Ana Sayfaya Dön</Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;