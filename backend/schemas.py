# backend/schemas.py
import datetime
from pydantic import BaseModel

# YENİ: Kullanıcı bilgisini geri döndürürken kullanacağımız model
class User(BaseModel):
    id: int
    email: str

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