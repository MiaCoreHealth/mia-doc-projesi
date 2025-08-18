// frontend/src/Profile.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  // Tüm profil alanları için state'ler oluşturuyoruz
  const [profileData, setProfileData] = useState({
    date_of_birth: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    pregnancy_status: '',
    smoking_status: '',
    alcohol_status: '',
    chronic_diseases: '',
    medications: '',
    family_history: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Sayfa yüklendiğinde mevcut profil verilerini çek
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('userToken');
      const apiUrl = process.env.REACT_APP_API_URL;
      try {
        const response = await axios.get(`${apiUrl}/profile/me/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // Gelen veriler null ise boş string'e çevirerek state'i doldur
        const data = response.data;
        const formattedData = {
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          height_cm: data.height_cm || '',
          weight_kg: data.weight_kg || '',
          pregnancy_status: data.pregnancy_status || '',
          smoking_status: data.smoking_status || '',
          alcohol_status: data.alcohol_status || '',
          chronic_diseases: data.chronic_diseases || '',
          medications: data.medications || '',
          family_history: data.family_history || ''
        };
        setProfileData(formattedData);
      } catch (error) {
        setMessage('Profil bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Formdaki bir alanı güncelleyen fonksiyon
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Değişiklikleri kaydetme fonksiyonu
  const handleSave = async (event) => {
    event.preventDefault();
    setMessage('');
    const token = localStorage.getItem('userToken');
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      // Boş string'leri null'a çevirerek gönder, veritabanı için daha temiz
      const dataToSend = { ...profileData };
      for (const key in dataToSend) {
        if (dataToSend[key] === '') {
          dataToSend[key] = null;
        }
      }

      await axios.post(`${apiUrl}/profile/me/`, dataToSend, {
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
        <p className="card-text text-muted">Bu bilgiler, yapay zekanın size daha kişisel ve doğru yorumlar yapmasına yardımcı olacaktır.</p>
        
        <form onSubmit={handleSave} className="row g-3">
          <div className="col-md-6">
            <label htmlFor="date_of_birth" className="form-label">Doğum Tarihi</label>
            <input type="date" className="form-control" id="date_of_birth" name="date_of_birth" value={profileData.date_of_birth} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label htmlFor="gender" className="form-label">Cinsiyet</label>
            <select className="form-select" id="gender" name="gender" value={profileData.gender} onChange={handleChange}>
              <option value="">Seçiniz...</option>
              <option value="Erkek">Erkek</option>
              <option value="Kadın">Kadın</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="height_cm" className="form-label">Boy (cm)</label>
            <input type="number" className="form-control" id="height_cm" name="height_cm" value={profileData.height_cm} onChange={handleChange} placeholder="Örn: 175"/>
          </div>
          <div className="col-md-6">
            <label htmlFor="weight_kg" className="form-label">Kilo (kg)</label>
            <input type="number" className="form-control" id="weight_kg" name="weight_kg" value={profileData.weight_kg} onChange={handleChange} placeholder="Örn: 70"/>
          </div>
          <div className="col-12">
            <label htmlFor="chronic_diseases" className="form-label">Bilinen Kronik Hastalıklarınız</label>
            <textarea className="form-control" id="chronic_diseases" name="chronic_diseases" rows="3" value={profileData.chronic_diseases} onChange={handleChange} placeholder="Örn: Diyabet Tip 2, Hipertansiyon"></textarea>
          </div>
          <div className="col-12">
            <label htmlFor="medications" className="form-label">Sürekli Kullandığınız İlaçlar</label>
            <textarea className="form-control" id="medications" name="medications" rows="3" value={profileData.medications} onChange={handleChange} placeholder="Örn: Metformin 1000mg, Ramipril 5mg"></textarea>
          </div>
          <div className="col-12">
            <label htmlFor="family_history" className="form-label">Aile Öyküsü (1. Derece Akrabalar)</label>
            <textarea className="form-control" id="family_history" name="family_history" rows="3" value={profileData.family_history} onChange={handleChange} placeholder="Örn: Annede tiroid, babada kalp hastalığı"></textarea>
          </div>
           {/* Diğer seçenekler (isteğe bağlı) */}
          <div className="col-md-4">
            <label htmlFor="smoking_status" className="form-label">Sigara Kullanımı</label>
            <select className="form-select" id="smoking_status" name="smoking_status" value={profileData.smoking_status} onChange={handleChange}>
              <option value="">Seçiniz...</option>
              <option value="Kullanmıyor">Kullanmıyor</option>
              <option value="Bıraktı">Bıraktı</option>
              <option value="Kullanıyor">Kullanıyor</option>
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="alcohol_status" className="form-label">Alkol Kullanımı</label>
            <select className="form-select" id="alcohol_status" name="alcohol_status" value={profileData.alcohol_status} onChange={handleChange}>
              <option value="">Seçiniz...</option>
              <option value="Kullanmıyor">Kullanmıyor</option>
              <option value="Sosyal">Sosyal</option>
              <option value="Düzenli">Düzenli</option>
            </select>
          </div>
          {/* Sadece Cinsiyet 'Kadın' seçilirse gösterilebilir, ama şimdilik basit tutalım */}
          <div className="col-md-4">
            <label htmlFor="pregnancy_status" className="form-label">Hamilelik Durumu</label>
            <select className="form-select" id="pregnancy_status" name="pregnancy_status" value={profileData.pregnancy_status} onChange={handleChange}>
              <option value="">Seçiniz...</option>
              <option value="Yok">Yok</option>
              <option value="Hamile">Hamile</option>
              <option value="Emziriyor">Emziriyor</option>
            </select>
          </div>

          {message && <div className={`alert mt-3 ${message.includes('başarıyla') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
          
          <div className="col-12 d-flex justify-content-end mt-4">
            <Link to="/" className="btn btn-secondary me-2">Kontrol Paneline Dön</Link>
            <button type="submit" className="btn btn-primary">Bilgileri Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;