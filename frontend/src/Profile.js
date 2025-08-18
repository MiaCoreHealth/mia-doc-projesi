// frontend/src/Profile.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const [chronicDiseases, setChronicDiseases] = useState('');
  const [medications, setMedications] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('userToken');
      const apiUrl = process.env.REACT_APP_API_URL;
      try {
        const response = await axios.get(`${apiUrl}/profile/me/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // Veritabanından gelen veriler null ise boş string ata
        setChronicDiseases(response.data.chronic_diseases || '');
        setMedications(response.data.medications || '');
      } catch (error) {
        setMessage('Profil bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage('');
    const token = localStorage.getItem('userToken');
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      await axios.post(`${apiUrl}/profile/me/`, {
        chronic_diseases: chronicDiseases,
        medications: medications
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage('Profil bilgileriniz başarıyla güncellendi!');
    } catch (error) {
      setMessage('Güncelleme sırasında bir hata oluştu.');
    }
  };

  if (isLoading) {
    return <p>Profil yükleniyor...</p>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Profil Bilgilerim</h2>
        <p className="card-text text-muted">Bu bilgiler, yapay zekanın size daha kişisel yorumlar yapmasına yardımcı olacaktır.</p>
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label htmlFor="chronicDiseases" className="form-label">Bilinen Kronik Hastalıklarınız</label>
            <textarea 
              className="form-control" 
              id="chronicDiseases" 
              rows="3"
              value={chronicDiseases}
              onChange={(e) => setChronicDiseases(e.target.value)}
              placeholder="Örn: Diyabet Tip 2, Hipertansiyon"
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="medications" className="form-label">Sürekli Kullandığınız İlaçlar</label>
            <textarea 
              className="form-control" 
              id="medications" 
              rows="3"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="Örn: Metformin 1000mg, Ramipril 5mg"
            ></textarea>
          </div>
          {message && <div className={`alert ${message.includes('başarıyla') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
          <div className="d-flex justify-content-end">
            <Link to="/" className="btn btn-secondary me-2">Kontrol Paneline Dön</Link>
            <button type="submit" className="btn btn-primary">Bilgileri Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;