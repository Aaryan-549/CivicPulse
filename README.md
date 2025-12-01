## Civic Pulse Platform

A comprehensive civic complaint management system connecting citizens, authorities, and AI validation.

### System Architecture

```
┌─────────────────┐
│  Mobile App     │ ──┐
│  (Flutter)      │   │
└─────────────────┘   │
                      │
┌─────────────────┐   │    ┌──────────────────┐
│  Admin Web      │ ──┼───▶│  Backend API     │
│  (React)        │   │    │  (Node.js)       │
└─────────────────┘   │    └──────────────────┘
                      │             │
                      │             │
                      │    ┌────────┴──────────┐
                      │    │                   │
                      │    ▼                   ▼
                      │  ┌──────────┐    ┌──────────┐
                      └─▶│ Database │    │  ML API  │
                         │ (Postgres)│    │ (Python) │
                         └──────────┘    └──────────┘
                              │
                              ▼
                         ┌──────────┐
                         │Cloudinary│
                         └──────────┘
```

### Project Structure

```
Civic-Pulse/
├── civicpulse-backend/      # Node.js Express API
├── civicpulse-frontend/     # React Admin Dashboard
├── civicpulse-app/          # Flutter Mobile App
└── civicpulse-ml/           # Python ML Service
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Flutter 3.10+
- Cloudinary account
- Git

---

## 1. Backend Setup (Node.js API)

```bash
cd civicpulse-backend
```

### Install Dependencies
```bash
npm install
```

### Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/civicpulse
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
PORT=5000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
ML_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

### Setup Database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Create Admin User
```bash
npx prisma studio
```
Navigate to Admins table and create a record:
- name: "Admin"
- email: "admin@civicpulse.com"
- passwordHash: Use bcrypt to hash "admin123" (or use Node.js console)

```javascript
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('admin123', 10));
```

### Run Backend
```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## 2. ML Service Setup (Python FastAPI)

```bash
cd civicpulse-ml
```

### Install Dependencies
```bash
pip install -e .
```
or
```bash
uv sync
```

### Download YOLOv8 Model (Optional)
Place trained license plate detection model at:
```
civicpulse-ml/models/plate_detector.pt
```

Or the service will use pretrained YOLOv8n.

### Run ML Service
```bash
cd src/civicpulse_ml
python main.py
```
or
```bash
uvicorn civicpulse_ml.main:app --reload --host 0.0.0.0 --port 8000
```

Service runs on `http://localhost:8000`

Test: `http://localhost:8000/health`

---

## 3. Admin Frontend Setup (React)

```bash
cd civicpulse-frontend
```

### Install Dependencies
```bash
npm install
```

### Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Run Frontend
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

**Login Credentials:**
- Email: `admin@civicpulse.com`
- Password: `admin123`

---

## 4. Mobile App Setup (Flutter)

```bash
cd civicpulse-app/app
```

### Install Dependencies
```bash
flutter pub get
```

### Configure API Endpoint
Edit `lib/config/api_config.dart`:
```dart
static const String baseUrl = 'http://YOUR_COMPUTER_IP:5000';
```

**Important:** For mobile testing on physical device or emulator, use your computer's local IP address, not `localhost`.

Find your IP:
- Windows: `ipconfig`
- Mac/Linux: `ifconfig`

Example: `http://192.168.1.100:5000`

### Run App
```bash
flutter run
```

Select your target device (Android Emulator, iOS Simulator, or Physical Device)

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/user/register` - User registration
- `POST /api/auth/user/login` - User login
- `POST /api/auth/admin/login` - Admin login

### Complaints
- `POST /api/complaints/civic` - Submit civic issue
- `POST /api/complaints/traffic` - Submit traffic violation
- `GET /api/complaints` - List all (admin)
- `GET /api/complaints/:id` - Get details
- `PUT /api/complaints/:id/assign` - Assign worker
- `PUT /api/complaints/:id/status` - Update status
- `POST /api/complaints/:id/reject` - Reject complaint

### Workers
- `GET /api/workers` - List workers
- `POST /api/workers` - Create worker
- `PUT /api/workers/:id` - Update worker

### Analytics
- `GET /api/analytics/heatmap` - Heatmap data
- `GET /api/analytics/dashboard` - Dashboard stats

### ML Service
- `POST /api/ocr/plate` - Detect license plate
- `POST /api/validate/image` - Validate image quality
- `GET /health` - Health check

---

## Workflow

### Citizen Flow (Mobile App)
1. User registers/logs in
2. Selects complaint category (Civic Issue or Traffic Violation)
3. Captures photo, location, description
4. Submits complaint
5. Backend receives → ML validates (if traffic) → Stored in DB
6. User can track status in "My Complaints"

### Admin Flow (Web Dashboard)
1. Admin logs in
2. Views all complaints on dashboard/heatmap
3. Reviews complaint details
4. Assigns worker to complaint
5. Updates status (Pending → In-Progress → Resolved)
6. Can reject invalid complaints

### ML Validation Flow (Traffic Violations)
1. Backend receives traffic violation with vehicle image
2. Sends image to ML service
3. ML detects license plate using YOLOv8
4. Extracts text using EasyOCR
5. Returns plate number + confidence score
6. If confidence >80%: Auto-approved
7. If confidence <80%: Manual review required

---

## Technology Stack

### Backend
- Node.js + Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication
- Cloudinary (Image Storage)
- Socket.io (Real-time)

### Frontend
- React + Vite
- TailwindCSS
- Leaflet Maps
- Axios + Socket.io Client

### Mobile
- Flutter
- Provider (State Management)
- HTTP Client
- Image Picker
- Geolocator

### ML Service
- Python FastAPI
- YOLOv8 (Ultralytics)
- EasyOCR
- OpenCV

---

## Database Schema

**Users:** Citizens who report complaints
**Admins:** Authority personnel
**Workers:** Field workers assigned to resolve complaints
**Complaints:** Civic issues and traffic violations
**Media:** Images associated with complaints
**StatusHistory:** Audit trail of status changes

---

## Environment Variables Summary

### Backend (.env)
```
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ML_SERVICE_URL=http://localhost:8000
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Mobile App (api_config.dart)
```
baseUrl = 'http://YOUR_IP:5000'
```

---

## Common Issues

### Backend won't start
- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- Run `npx prisma generate`

### ML Service errors
- Install PyTorch with CUDA if using GPU
- Ensure all Python dependencies installed
- Model file might be missing (will fallback to YOLOv8n)

### Mobile app can't connect
- Use computer's IP, not localhost
- Ensure backend is accessible from network
- Check firewall settings

### Frontend can't fetch data
- Verify backend is running on port 5000
- Check CORS settings in backend
- Verify .env file exists

---

## Development Tips

### Testing API with cURL
```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@civicpulse.com","password":"admin123"}'
```

### Reset Database
```bash
cd civicpulse-backend
npx prisma migrate reset
```

### View Database
```bash
npx prisma studio
```

### Hot Reload
- Backend: Uses nodemon (automatic)
- Frontend: Uses Vite HMR (automatic)
- Mobile: Uses Flutter hot reload (press 'r')
- ML: Uses uvicorn --reload (automatic)

---

## Deployment Checklist

- [ ] Set production DATABASE_URL
- [ ] Change JWT_SECRET to strong random string
- [ ] Set NODE_ENV=production
- [ ] Configure Cloudinary for production
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure CORS for production domains
- [ ] Build frontend: `npm run build`
- [ ] Deploy ML service with GPU support
- [ ] Set up monitoring and logging
- [ ] Configure database backups
- [ ] Set up CI/CD pipeline

---

## License

MIT
