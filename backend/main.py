# backend/main.py

import shutil
import os
import uuid
import datetime
from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
import google.generativeai as genai
from PIL import Image
import io

# Diğer Python dosyalarımızı içe aktarıyoruz
import models
import schemas
import security
from database import engine, SessionLocal

# Gemini API Anahtarınız
GOOGLE_API_KEY = "AIzaSyAAnQ3tSBu8rkUtF3C_LLH4BIvZEdduEqM" # Lütfen kendi anahtarınızın burada olduğundan emin olun.
genai.configure(api_key=GOOGLE_API_KEY)

# Veritabanı tablolarını oluştur
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS Ayarları ---
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Veritabanı Bağımlılığı ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Kimlik Doğrulama Mekanizması ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# --- API Endpoints ---

@app.post("/register/")
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Bu e-posta adresi zaten kayıtlı.")
    new_user = models.User(email=user.email, hashed_password=security.hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"mesaj": f"{new_user.email} adresiyle kullanıcı başarıyla oluşturuldu.", "user_id": new_user.id}

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-posta veya şifre hatalı.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/report/analyze/")
async def analyze_report(file: UploadFile = File(...), current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents))
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    
    prompt = """
    Senin adın MİA-DOC. Sen, bir doktorun hastasıyla konuşuyormuş gibi davranan, empatik, sakin ve profesyonel bir yapay zeka sağlık asistanısın. Görevin, sana verilen tıbbi rapor görselini yorumlamaktır.

    YORUMLAMA KURALLARIN:
    1.  **ASLA TEŞHİS KOYMA:** "Şu hastalığınız olabilir", "bu kanser belirtisidir", "böbrek yetmezliğiniz var" gibi ifadeler KESİNLİKLE KULLANMA.
    2.  **ASLA TEDAVİ ÖNERME:** "Şu ilacı alın", "şunu yiyin" gibi önerilerde BULUNMA.
    3.  **YORUMLA VE BİLGİLENDİR:** Her bir anormal sonucu (referans aralığının altı veya üstü) tek tek ele al.
        * Bu sonucun hangi organ veya vücut sistemiyle (örn: karaciğer, böbrek, kan hücreleri, iltihap durumu) ilgili olduğunu açıkla.
        * Bu değerin neden yükselebileceği veya düşebileceği hakkında GENEL ve OLASI faktörlerden bahset (örn: "Demir eksikliği, bazı vitamin eksiklikleri veya kronik hastalıklar bu değeri etkileyebilir."). Spesifik bir neden atama.
        * Sonucu, hastanın anlayacağı basit bir dilde, analojiler kullanarak açıkla.
    4.  **DOKTORA YÖNLENDİR:** Yorumunun sonunda, hastayı bu sonuçları kendi doktoruyla konuşmaya teşvik et. Hatta doktoruna hangi ek bilgileri vermesinin (örn: son zamanlardaki şikayetleri, kullandığı ilaçlar) faydalı olabileceğine dair ipuçları ver.
    5.  **ZORUNLU UYARI:** Cevabının en sonunda MUTLAKA şu uyarıyı ekle: "Bu yorumlar tıbbi bir teşhis niteliği taşımaz. Lütfen sonuçlarınızı sizi takip eden hekimle veya başka bir sağlık profesyoneliyle yüz yüze görüşünüz."
    """
    
    try:
        response = model.generate_content([prompt, img], stream=True)
        response.resolve()
        analysis_text = response.text

        new_report = models.Report(
            original_filename=file.filename,
            analysis_result=analysis_text,
            owner_id=current_user.id,
            upload_date=datetime.datetime.now(datetime.UTC)
        )
        db.add(new_report)
        db.commit()
        db.refresh(new_report)

        return {"analysis_result": analysis_text}
    except Exception as e:
        print(f"DETAYLI HATA RAPORU: {e}")
        raise HTTPException(status_code=500, detail=f"Yapay zeka ile iletişim sırasında bir hata oluştu: {str(e)}")

@app.get("/reports/history/", response_model=list[schemas.Report])
def get_user_reports(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    reports = db.query(models.Report).filter(models.Report.owner_id == current_user.id).order_by(models.Report.upload_date.desc()).all()
    return reports