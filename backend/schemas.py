# backend/schemas.py
import datetime
from pydantic import BaseModel

# Rapor verisini Frontend'e gönderirken kullanacağımız model
class Report(BaseModel):
    id: int
    original_filename: str
    analysis_result: str
    upload_date: datetime.datetime

    class Config:
        from_attributes = True # SQLAlchemy modelleriyle uyumlu çalışmasını sağlar

class UserCreate(BaseModel):
    email: str
    password: str