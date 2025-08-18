# backend/schemas.py
import datetime
from pydantic import BaseModel
from typing import Optional # YENİ: Boş olabilecek alanlar için

# YENİ: Profil güncelleme için kullanılacak model
class ProfileUpdate(BaseModel):
    chronic_diseases: Optional[str] = None
    medications: Optional[str] = None

class User(BaseModel):
    id: int
    email: str
    # YENİ: Kullanıcı bilgisini döndürürken bu alanları da ekliyoruz
    chronic_diseases: Optional[str] = None
    medications: Optional[str] = None

    class Config:
        from_attributes = True

class Report(BaseModel):
    id: int
    original_filename: str
    analysis_result: str
    upload_date: datetime.datetime

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: str
    password: str