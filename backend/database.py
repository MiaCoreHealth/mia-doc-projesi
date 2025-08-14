# backend/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Projemizin ana klasöründe "mia-doc.db" adında bir veritabanı dosyası oluşturacağız.
# SQLite, sunucu gerektirmeyen, basit ve dosya tabanlı bir veritabanıdır. Başlangıç için mükemmel.
SQLALCHEMY_DATABASE_URL = "sqlite:///./mia-doc.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()