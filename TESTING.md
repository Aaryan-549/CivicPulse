# Civic Pulse - End-to-End Testing Guide

This guide walks through testing the complete flow of the Civic Pulse platform.

## System Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Flutter App    │─────▶│  Backend API    │─────▶│   ML Service    │
│  (Citizens)     │      │  (Node.js)      │      │   (Python)      │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                               │     ▲
                               │     │
                               ▼     │
                         ┌─────────────────┐
                         │  React Admin    │
                         │  (Authorities)  │
                         └─────────────────┘
```

## Prerequisites

- PostgreSQL 18.1 installed and running
- Node.js 18+ installed
- Flutter SDK 3.0+ installed
- Python 3.11+ installed (for ML service)
- Android Studio with Pixel 7 Pro emulator (or physical device)

## Step 1: Backend Setup

### 1.1 Start Backend Server

```powershell
cd C:\Users\Aaryan\Downloads\Civic-Pulse\civicpulse-backend
npm run dev
```

**Expected Output:**
```
Server running on port 5000
Environment: development
```

### 1.2 Verify Backend Health

Open browser: `http://localhost:5000/health`

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-27T..."
}
```

### 1.3 Verify Admin User

Default admin credentials:
- Email: `admin@civicpulse.com`
- Password: `admin123`

Test admin login:
```powershell
curl -X POST http://localhost:5000/api/auth/admin/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@civicpulse.com\",\"password\":\"admin123\"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "admin": {...},
    "token": "eyJhbGc..."
  }
}
```

## Step 2: Flutter App Setup

### 2.1 Install Dependencies

```powershell
cd C:\Users\Aaryan\Downloads\Civic-Pulse\civicpulse-app\app
flutter pub get
```

### 2.2 Verify API Configuration

File: `lib/config/api_config.dart`

Should have:
```dart
static const String baseUrl = 'http://10.0.2.2:5000';
```

**Note:** `10.0.2.2` is the special IP for Android emulator to access host machine's localhost.

### 2.3 Start Android Emulator

1. Open Android Studio
2. Open AVD Manager
3. Start Pixel 7 Pro emulator

### 2.4 Run Flutter App

```powershell
cd C:\Users\Aaryan\Downloads\Civic-Pulse\civicpulse-app\app
flutter run
```

Select the Pixel 7 Pro emulator when prompted.

## Step 3: Test User Flow (Mobile App)

### 3.1 User Registration

1. Open app on emulator
2. Tap "Sign Up" or "Register"
3. Fill in details:
   - Name: `Test User`
   - Email: `test@example.com`
   - Phone: `+919876543210`
   - Password: `password123`
4. Tap "Register"

**Expected:** User logged in, redirected to home screen

**Backend Log:** Should show POST `/api/auth/user/register` - 201

### 3.2 Submit Civic Issue

1. Tap "Report Issue" or "New Complaint"
2. Select "Civic Issue"
3. Fill in:
   - Category: `Water Supply & Sanitation`
   - Subcategory: `Leaking Pipes`
   - Description: `Water pipe burst on main road`
   - Address: Enable location or enter manually
4. Tap "Add Photo" (optional)
5. Tap "Submit"

**Expected:**
- Success message shown
- Complaint appears in "My Complaints" list
- Status: "Pending"

**Backend Log:** Should show:
```
POST /api/complaints/civic - 201
Socket.io: complaint:created event emitted
```

### 3.3 Submit Traffic Violation (with ML validation)

1. Tap "Report Issue"
2. Select "Traffic Violation"
3. Fill in:
   - Category: `Parking Violation`
   - Description: `Illegal parking blocking road`
   - Address: Current location
4. Tap "Add Photo" (required for ML validation)
5. Tap "Submit"

**Expected:**
- If ML service running & plate detected: Status = "Approved" or "Manual Review"
- If ML service not running: Status = "Manual Review"
- Complaint appears in list with detected plate number (if any)

**Backend Log:** Should show:
```
POST /api/complaints/traffic - 201
Attempting ML validation...
[If ML service running] ML response: {...}
Socket.io: complaint:created event emitted
```

### 3.4 View Complaint Details

1. Go to "My Complaints"
2. Tap on any complaint
3. View full details

**Expected:**
- All complaint info displayed
- Current status visible
- Worker info (if assigned)
- Images displayed
- Status history

## Step 4: Test Admin Flow (React Dashboard)

### 4.1 Start Frontend

Open new terminal:
```powershell
cd C:\Users\Aaryan\Downloads\Civic-Pulse\civicpulse-frontend
npm run dev
```

**Expected Output:**
```
VITE ready in XXXms
Local: http://localhost:5173
```

### 4.2 Admin Login

1. Open browser: `http://localhost:5173`
2. Login with:
   - Email: `admin@civicpulse.com`
   - Password: `admin123`

**Expected:** Redirected to admin dashboard

**Browser Console:** Should show:
```
Socket connected
```

### 4.3 View Complaints Dashboard

1. Navigate to "Complaints" section
2. View list of all complaints

**Expected:**
- See all complaints from test user
- Filters work (status, category, type)
- Real-time updates when new complaints submitted

**Test Real-time:** Submit new complaint from mobile app, should appear immediately in dashboard without refresh.

### 4.4 Create Worker

1. Navigate to "Workers" section
2. Click "Add Worker"
3. Fill in:
   - Name: `John Worker`
   - Email: `worker@example.com`
   - Phone: `+919876543211`
4. Click "Create"

**Expected:** Worker created and appears in list

### 4.5 Assign Worker to Complaint

1. Go to "Complaints"
2. Click on a pending complaint
3. Click "Assign Worker"
4. Select the worker created above
5. Confirm assignment

**Expected:**
- Complaint status changes to "In-Progress"
- Worker name displayed on complaint
- Socket.io event emitted

**Backend Log:**
```
PUT /api/complaints/:id/assign - 200
Socket.io: complaint:updated event emitted
```

**Mobile App:** Check "My Complaints" - status should update to "In-Progress" with worker name (may need to refresh or reopen)

### 4.6 Update Complaint Status

1. Click on the complaint
2. Click "Update Status"
3. Select "Resolved"
4. Confirm

**Expected:**
- Complaint status changes to "Resolved"
- Resolved timestamp recorded
- Socket.io event emitted

**Backend Log:**
```
PUT /api/complaints/:id/status - 200
Socket.io: complaint:updated event emitted
```

**Mobile App:** Check complaint - status should show "Resolved"

## Step 5: Test Real-time Updates

### 5.1 Keep Both Apps Open

- Mobile app showing "My Complaints"
- Web dashboard showing complaint list

### 5.2 Update Status from Web

1. In web dashboard, change a complaint status
2. Observe mobile app

**Expected:** Status updates in mobile app within seconds (if socket connected)

### 5.3 Create Complaint from Mobile

1. Submit new complaint from mobile
2. Observe web dashboard

**Expected:** New complaint appears in dashboard without refresh

## Step 6: Optional - ML Service Testing

### 6.1 Start ML Service

```powershell
cd C:\Users\Aaryan\Downloads\Civic-Pulse\civicpulse-ml
uv run python src/app/main.py
```

**Expected Output:**
```
INFO: Uvicorn running on http://0.0.0.0:8000
```

### 6.2 Verify ML Service

Open browser: `http://localhost:8000/health`

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "Civic Pulse ML Service"
}
```

### 6.3 Test License Plate Detection

1. Submit traffic violation from mobile app with clear license plate photo
2. Check response in app

**Expected:**
- Plate number auto-detected and displayed
- Confidence score shown
- Status: "Approved" (if confidence >= 80%) or "Manual Review"

**Backend Log:**
```
ML Service: Detected plate ABC1234 with confidence 0.92
```

## Common Issues & Troubleshooting

### Issue 1: Backend can't connect to PostgreSQL

**Solution:**
```powershell
# Check PostgreSQL is running
Get-Service postgresql*

# If not running, start it
Start-Service postgresql-x64-18

# Verify connection
psql -U postgres -d civicpulse
```

### Issue 2: Mobile app can't connect to backend

**Symptoms:** "Connection error" in app

**Solutions:**
- Ensure backend running on port 5000
- Verify API config uses `10.0.2.2:5000`
- Check firewall not blocking port 5000
- Test: `curl http://localhost:5000/health` from host machine

### Issue 3: Socket.io not connecting

**Check:**
- CORS configured in backend (`localhost:5173` allowed)
- Socket.io client versions match
- Browser console for connection errors

### Issue 4: ML validation always fails

**Expected Behavior:** If ML service not running, traffic complaints default to "Manual Review" status. This is correct behavior.

**To enable ML:**
1. Ensure Python 3.11+ installed
2. Start ML service: `uv run python src/app/main.py`
3. Verify `ML_SERVICE_URL=http://localhost:8000` in backend `.env`

## Verification Checklist

- [ ] Backend health check responds
- [ ] Admin can login to web dashboard
- [ ] User can register in mobile app
- [ ] User can submit civic issue
- [ ] User can submit traffic violation
- [ ] User can view their complaints
- [ ] User can see complaint details
- [ ] Admin can view all complaints
- [ ] Admin can create workers
- [ ] Admin can assign workers to complaints
- [ ] Admin can update complaint status
- [ ] Status updates reflect in mobile app
- [ ] New complaints appear in dashboard real-time
- [ ] Socket.io events working
- [ ] ML service validates traffic violations (optional)

## Database Inspection

To inspect database directly:

```powershell
cd C:\Users\Aaryan\Downloads\Civic-Pulse\civicpulse-backend
npx prisma studio
```

Opens Prisma Studio on `http://localhost:5555`

View all:
- Users
- Admins
- Complaints
- Workers
- Media
- StatusHistory

## API Testing with curl

### Get all complaints (admin)
```powershell
$token = "ADMIN_TOKEN_HERE"
curl -H "Authorization: Bearer $token" http://localhost:5000/api/complaints
```

### Get user profile
```powershell
$token = "USER_TOKEN_HERE"
curl -H "Authorization: Bearer $token" http://localhost:5000/api/users/profile
```

### Create worker
```powershell
$token = "ADMIN_TOKEN_HERE"
curl -X POST http://localhost:5000/api/workers `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Worker Name\",\"email\":\"worker@test.com\",\"phone\":\"+919876543212\"}'
```

## Performance Notes

- Backend handles 50 complaints per page (pagination)
- Images uploaded to Cloudinary (not stored locally)
- Socket.io maintains persistent connections
- JWT tokens expire after 7 days
- ML validation timeout: 30 seconds

## Next Steps

After successful testing:

1. Add more sample workers for testing assignment
2. Test with multiple users simultaneously
3. Test complaint filtering and search
4. Test analytics dashboard
5. Test with real device (not just emulator)
6. Deploy to production environment

## Support

Issues? Check:
- Backend logs in terminal
- Browser console (for web dashboard)
- Flutter console (for mobile app)
- Network tab in DevTools
- Database state in Prisma Studio
