# Deployment Guide | دليل النشر

## الخيار 1: تشغيل محلي (Local)

### المتطلبات
- Python 3.12+
- pip

### الخطوات
```bash
# 1. استنساخ المشروع
git clone https://github.com/freelife2000/quran.git
cd quran

# 2. إنشاء بيئة افتراضية
python3 -m venv .venv
source .venv/bin/activate  # Linux/Mac
# أو
.venv\Scripts\activate  # Windows

# 3. تثبيت المكتبات
pip install -r requirements.txt

# 4. تشغيل الخادم
python -m uvicorn app.server:app --host 127.0.0.1 --port 8000 --reload

# 5. افتح المتصفح
# http://127.0.0.1:8000
```

---

## الخيار 2: Docker (الأسهل)

### المتطلبات
- Docker
- Docker Compose (اختياري)

### الخطوات

#### باستخدام docker-compose (الموصى به):
```bash
# 1. استنساخ المشروع
git clone https://github.com/freelife2000/quran.git
cd quran

# 2. بناء وتشغيل الحاوية
docker-compose up -d

# 3. افتح المتصفح
# http://localhost:8000

# 4. إيقاف الخدمة
docker-compose down
```

#### باستخدام Docker مباشرة:
```bash
# 1. بناء الصورة
docker build -t quran-app .

# 2. تشغيل الحاوية
docker run -d \
  --name quran \
  -p 8000:8000 \
  -v $(pwd)/data:/app/data \
  quran-app

# 3. عرض السجلات
docker logs -f quran

# 4. إيقاف الحاوية
docker stop quran
docker rm quran
```

---

## الخيار 3: Linux Server (مع Systemd)

### المتطلبات
- Python 3.12+
- Systemd

### الخطوات

1. **استنساخ المشروع**:
```bash
git clone https://github.com/freelive2000/quran.git /opt/quran
cd /opt/quran
```

2. **إنشاء بيئة افتراضية**:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. **إنشاء ملف Systemd Service**:
```bash
sudo nano /etc/systemd/system/quran.service
```

أضف المحتوى التالي:
```ini
[Unit]
Description=Quran Application
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/opt/quran
Environment="PATH=/opt/quran/venv/bin"
ExecStart=/opt/quran/venv/bin/python -m uvicorn app.server:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

4. **تفعيل وتشغيل الخدمة**:
```bash
sudo systemctl daemon-reload
sudo systemctl enable quran
sudo systemctl start quran
sudo systemctl status quran
```

---

## الخيار 4: Nginx Reverse Proxy

### الخطوات

1. **تثبيت Nginx**:
```bash
sudo apt-get update
sudo apt-get install nginx
```

2. **إنشاء ملف إعداد Nginx**:
```bash
sudo nano /etc/nginx/sites-available/quran
```

أضف المحتوى التالي:
```nginx
upstream quran_app {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://quran_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # تخزين مؤقت للملفات الثابتة
    location /static/ {
        alias /opt/quran/web/;
        expires 7d;
    }
}
```

3. **تفعيل الموقع**:
```bash
sudo ln -s /etc/nginx/sites-available/quran /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## الخيار 5: Heroku / Railway / Render

### المتطلبات
- حساب على المنصة
- Git

### الخطوات

#### Railway (الموصى به):

1. **ادفع إلى GitHub**:
```bash
git push origin main
```

2. **قم بالدخول إلى Railway**:
- اذهب إلى https://railway.app
- اختر "New Project"
- اختر "Deploy from GitHub"
- اختر المستودع `quran`

3. **أضف متغيرات البيئة** (إن لزم الأمر):
```
PYTHONUNBUFFERED=1
```

4. **Railway سيكتشف تلقائياً**:
- `Dockerfile` سيتم استخدامه
- سيتم تعيين URL تلقائي

---

## التحقق من الخادم | Health Check

```bash
# اختبر الخادم
curl http://localhost:8000/

# اختبر الترجمات
curl http://localhost:8000/api/translations

# اختبر آية
curl http://localhost:8000/api/verse/1/1

# اختبر أوقات الصلاة
curl http://localhost:8000/api/prayer-times
```

---

## المراقبة والسجلات

### محلي:
```bash
# عرض السجلات المباشرة
python -m uvicorn app.server:app --host 0.0.0.0 --port 8000
```

### Docker:
```bash
docker logs -f quran
```

### Systemd:
```bash
sudo journalctl -u quran -f
```

---

## استكشاف الأخطاء

### المشكلة: الخادم لا يبدأ
```bash
# تحقق من المتطلبات
pip list

# أعد التثبيت
pip install --upgrade -r requirements.txt

# جرب مع --reload معطل
python -m uvicorn app.server:app --host 0.0.0.0 --port 8000 --no-reload
```

### المشكلة: الموارد غير محملة
```bash
# تأكد من وجود الملفات
ls -la data/
ls -la web/

# إعادة بناء Docker
docker build --no-cache -t quran-app .
```

### المشكلة: CORS errors
تأكد من أن CORS مفعل في `app/server.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # أو حد من النطاقات
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## الأداء والتحسينات

### قائمة التحقق:

- [ ] استخدم CDN لتوزيع الملفات الثابتة (CSS, JS)
- [ ] فعّل الضغط (gzip) على Nginx
- [ ] استخدم Redis للتخزين المؤقت
- [ ] راقب استهلاك الموارد
- [ ] استخدم Load Balancer إذا كنت تتوقع حركة مرور عالية

---

## الأمان

### قائمة التحقق:

- [ ] استخدم HTTPS (Let's Encrypt)
- [ ] حدد النطاقات المسموحة في CORS
- [ ] استخدم متغيرات البيئة للإعدادات الحساسة
- [ ] راقب وسجّل جميع الأنشطة
- [ ] حدّث المكتبات بانتظام

---

**للمزيد من المعلومات**: اطلع على [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

**للمساعدة**: افتح Issue على GitHub 📧
