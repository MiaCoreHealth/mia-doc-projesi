# backend/models.py

import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Bu satır doğru: Bir kullanıcının birden çok "reports" (raporları) vardır.
    reports = relationship("Report", back_populates="owner")

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    original_filename = Column(String)
    analysis_result = Column(Text)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    
    owner_id = Column(Integer, ForeignKey("users.id"))

    # ---- DÜZELTME BURADA ----
    # Bu raporun sahibinin ("owner"), User tablosundaki "reports" listesine ait olduğunu
    # 'back_populates' ile doğru şekilde belirtiyoruz.
    owner = relationship("User", back_populates="reports")
    # -------------------------