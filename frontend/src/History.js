// frontend/src/History.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
        const response = await axios.get(`${apiUrl}/reports/history/', {
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

  const formatToLocalTime = (utcDateString) => {
    const date = new Date(utcDateString);
    const localDate = addHours(date, 3); // Manuel saat dilimi düzeltmesi
    return format(localDate, "dd MMMM yyyy, HH:mm:ss");
  };

  // ---- GÖRSEL DEĞİŞİKLİKLER BURADA (BOOTSTRAP ACCORDION) ----
  return (
    <div className="mt-5">
      <h3 className="mb-3">Geçmiş Raporlarım</h3>
      {message && <p className="text-muted">{message}</p>}
      
      <div className="accordion" id="reportHistoryAccordion">
        {reports.map((report, index) => (
          <div className="accordion-item" key={report.id}>
            <h2 className="accordion-header" id={`heading-${report.id}`}>
              <button 
                className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`} 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target={`#collapse-${report.id}`} 
                aria-expanded={index === 0} 
                aria-controls={`collapse-${report.id}`}
              >
                <span className="fw-bold">{report.original_filename}</span>
                <span className="ms-auto text-muted small">{formatToLocalTime(report.upload_date)}</span>
              </button>
            </h2>
            <div 
              id={`collapse-${report.id}`} 
              className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} 
              aria-labelledby={`heading-${report.id}`} 
              data-bs-parent="#reportHistoryAccordion"
            >
              <div className="accordion-body" style={{ whiteSpace: 'pre-wrap' }}>
                {report.analysis_result}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;