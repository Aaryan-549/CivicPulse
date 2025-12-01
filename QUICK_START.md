# Civic Pulse - Quick Start Guide

## 🚀 Start Everything in 5 Minutes

### Step 1: Start Backend (Required)

```powershell
cd C:\Users\Aaryan\Downloads\Civic-Pulse\civicpulse-backend
npm run dev
```

**Expected Output:**
```
Server running on port 5000
Environment: development
```

**Keep this terminal open!**

---

### Step 2: Run Mobile App (Required)

Open **NEW** terminal:

```powershell
cd C:\Users\Aaryan\Downloads\Civic-Pulse\civicpulse-app\app
flutter run
```

**Select:** Pixel 7 Pro emulator when prompted

**Expected:** App launches on emulator

**Keep this terminal open!**

---

### Step 3: Test the App

#### 3.1 Register User
1. On emulator, tap "Sign Up"
2. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Phone: `+919876543210`
   - Password: `password123`
3. Tap "Register"

#### 3.2 Submit Issue
1. Tap "Report Issue" (or similar)
2. Select "Civic Issue"
3. Fill in:
   - Category: `Water Supply`
   - Description: `Pipe burst on main road`
   - Location: Enable GPS or enter manually
4. Tap "Submit"

**✅ Expected:** Success message, complaint appears in list

---

### Step 4: Start Admin Dashboard (Required)

Open **NEW** terminal:

```powershell
cd C:\Users\Aaryan\Downloads\Civic-Pulse\civicpulse-frontend
npm run dev
```

**Open browser:** http://localhost:5173

**Login with:**
- Email: `admin@civicpulse.com`
- Password: `admin123`

**✅ Expected:** You see the complaint submitted from mobile app!

---

### Step 5: Test Real-time Updates

#### 5.1 Create Worker
1. In admin dashboard, go to "Workers"
2. Click "Add Worker"
3. Fill in:
   - Name: `John Worker`
   - Email: `worker@test.com`
   - Phone: `+919999999999`
4. Click "Create"

#### 5.2 Assign Worker
1. Go to "Complaints"
2. Click on the test complaint
3. Click "Assign Worker"
4. Select "John Worker"
5. Confirm

**✅ Check mobile app:** Status should change to "In-Progress"

#### 5.3 Resolve Complaint
1. Click "Update Status"
2. Select "Resolved"
3. Confirm

**✅ Check mobile app:** Status should change to "Resolved"

---

## 🎯 Optional: Enable ML Validation

For traffic violations with license plate detection:

Open **NEW** terminal:

```powershell
cd C:\Users\Aaryan\Downloads\Civic-Pulse\civicpulse-ml
uv run python src/app/main.py
```

**Expected:** Uvicorn running on http://localhost:8000

Now submit a traffic violation with a clear license plate photo from the mobile app!

---

## 🔧 Troubleshooting

### Backend won't start
```powershell
# Check PostgreSQL is running
Get-Service postgresql*

# If stopped, start it
Start-Service postgresql-x64-18
```

### Mobile app "Connection Error"
- Ensure backend is running (Step 1)
- Check backend terminal for errors
- Verify `lib/config/api_config.dart` has `http://10.0.2.2:5000`

### Admin can't login
- Default credentials:
  - Email: `admin@civicpulse.com`
  - Password: `admin123`
- If forgot, run: `cd civicpulse-backend && npm run prisma:seed`

---

## 📋 What's Running

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Backend | 5000 | http://localhost:5000 | Required ✅ |
| Frontend | 5173 | http://localhost:5173 | Required ✅ |
| ML Service | 8000 | http://localhost:8000 | Optional ⭐ |
| Mobile App | - | Android Emulator | Required ✅ |

---

## ✨ Quick Health Checks

### Test Backend
```powershell
curl http://localhost:5000/health
```
**Expected:** `{"status":"healthy",...}`

### Test Frontend
Open browser: http://localhost:5173

### Test ML Service (if running)
```powershell
curl http://localhost:8000/health
```
**Expected:** `{"status":"healthy",...}`

---

## 🎬 Complete Flow Test

1. ✅ **Mobile:** Register user
2. ✅ **Mobile:** Submit civic issue
3. ✅ **Web:** Login as admin
4. ✅ **Web:** See complaint appear
5. ✅ **Web:** Create worker
6. ✅ **Web:** Assign worker to complaint
7. ✅ **Mobile:** See status change to "In-Progress"
8. ✅ **Web:** Update status to "Resolved"
9. ✅ **Mobile:** See status change to "Resolved"

**All working? 🎉 Your system is fully functional!**

---

## 📚 Documentation

- **Full Testing Guide:** `TESTING.md`
- **Implementation Details:** `IMPLEMENTATION_SUMMARY.md`
- **Backend API:** `civicpulse-backend/README.md`
- **Database:** Prisma Studio → `npx prisma studio`

---

## 🆘 Need Help?

**Backend Logs:** Check the terminal where `npm run dev` is running

**Frontend Logs:** Check browser console (F12)

**Mobile Logs:** Check the terminal where `flutter run` is running

**Database:** Run `npx prisma studio` from `civicpulse-backend/`

---

## 🎯 Next Steps

After successful testing:
1. Add more test data (workers, complaints)
2. Test analytics dashboard
3. Test filtering and search
4. Configure Cloudinary for image uploads
5. Deploy to production

---

**Ready? Start with Step 1! 🚀**
