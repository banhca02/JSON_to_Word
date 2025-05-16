# JSON to Word Converter 📝

Ứng dụng cho phép người dùng nhập dữ liệu JSON và xuất ra file Word (.docx).  

## Lấy URL backend
- Tạo file frontend/.env
- Dán đoạn mã sau
```bash
REACT_APP_API_URL=http://localhost:8000
```

## 🚀 Khởi chạy dự án bằng Docker

### 1. Yêu cầu:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Build frontend
```bash
 cd frontend
 npm install
 npm run build
 cd ..
```

### 2. Build và chạy
```bash
docker compose up --build
```

- Truy cập frontend: [http://localhost:3000](http://localhost)  
- API backend: [http://localhost:8000](http://localhost:8000)

---

## 🖥️ Chạy thủ công không dùng Docker

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate     # hoặc venv\Scripts\activate trên Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (React)

```bash
cd frontend
npm install
npm start
```

