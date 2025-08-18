// frontend/src/Dashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Link'i buraya import ediyoruz
import axios from 'axios';
import History from './History';

function Dashboard({ handleLogout }) {
  const [user, setUser] = useState(null);
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