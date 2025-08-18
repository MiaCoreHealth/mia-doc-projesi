# backend/models.py

import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=False)

    # YENİ ALANLAR: Bu alanlar boş olabilir (nullable=True)
    chronic_diseases = Column(Text, nullable=True) # Kronik hastalıklar
    medications = Column(Text, nullable=True)      # Sürekli kullanılan ilaçlar

    reports = relationship("Report", back_populates="owner")

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    original_filename = Column(String)
    analysis_result = Column(Text)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="reports")