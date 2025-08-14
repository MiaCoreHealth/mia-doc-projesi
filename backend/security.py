# backend/security.py

from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext

# --- Şifreleme Ayarları (Mevcut Kısım) ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- YENİ: JWT (Giriş Kartı) Ayarları ---
# Bu, bizim gizli anahtarımız. Bu anahtar sayesinde kartların bizim tarafımızdan imzalandığını anlıyoruz.
# Bu anahtarı kimseyle paylaşmamalısınız. Gerçek bir projede bu daha karmaşık bir yerden okunur.
SECRET_KEY = "MIA-DOC-COK-GIZLI-ANAHTAR-010203"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Kartın geçerlilik süresi (30 dakika)

# --- Fonksiyonlar ---

def verify_password(plain_password, hashed_password):
    """Girilen şifre ile veritabanındaki hash'lenmiş şifreyi karşılaştırır."""
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str):
    """Şifreyi hash'ler."""
    return pwd_context.hash(password)

def create_access_token(data: dict):
    """Verilen bilgilere göre yeni bir giriş kartı (access token) oluşturur."""
    to_encode = data.copy()
    # Kartın son kullanma tarihini hesapla
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    # Gizli anahtarımızı kullanarak kartı imzala ve oluştur
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt