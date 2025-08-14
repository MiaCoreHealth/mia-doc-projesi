// frontend/src/History.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// YENİ: Saate saat eklemek için 'addHours' fonksiyonunu da import ediyoruz
import { format, addHours } from 'date-fns';

function History() {
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('Geçmiş raporlar yükleniyor...');

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setMessage('Geçmişi görmek için giriş yapmalısınız.');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/reports/history/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.length === 0) {
          setMessage('Henüz analiz edilmiş bir raporunuz bulunmuyor.');
        } else {
          setReports(response.data);
          setMessage('');
        }
      } catch (error) {
        setMessage('Rapor geçmişi yüklenirken bir hata oluştu.');
      }
    };

    fetchHistory();
  }, []);

  // Gelen UTC saatini alıp, üzerine 3 saat ekleyip formatlayan fonksiyon
  const formatToLocalTime = (utcDateString) => {
    const date = new Date(utcDateString);
    // ---- MANUEL DÜZELTME BURADA ----
    // Türkiye UTC+3 olduğu için, gelen UTC saatine 3 saat ekliyoruz.
    const localDate = addHours(date, 3);
    // -------------------------------

    // Şimdi, zaten düzelttiğimiz bu tarihi formatlıyoruz.
    return format(localDate, "dd MMMM yyyy, HH:mm:ss");
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h3>Geçmiş Raporlarım</h3>
      {message && <p>{message}</p>}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {reports.map((report) => (
          <div key={report.id} /* ... */ >
            <p><strong>Dosya Adı:</strong> {report.original_filename}</p>
            <p><strong>Tarih:</strong> {formatToLocalTime(report.upload_date)}</p>
            <details>
              <summary>Analiz Sonucunu Göster</summary>
              <p style={{ /* ... */ }}>
                {report.analysis_result}
              </p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;