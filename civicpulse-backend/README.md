# Civic Pulse Backend API

Backend API server for the Civic Pulse platform that connects citizens, authorities, and ML validation services.

## Tech Stack

- Node.js + Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication
- Cloudinary (Image Storage)
- Socket.io (Real-time Updates)

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Cloudinary account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
DATABASE_URL=postgresql://username:password@localhost:5432/civicpulse
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=5000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
ML_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

4. Set up database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Seed initial admin:
```bash
npm run prisma:seed
```
This creates default admin:
- Email: `admin@civicpulse.com`
- Password: `admin123`

### Development

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Production

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/user/register` - Register new user
- `POST /api/auth/user/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/refresh` - Refresh JWT token

### Complaints

- `POST /api/complaints/civic` - Submit civic issue (Auth: User)
- `POST /api/complaints/traffic` - Submit traffic violation (Auth: User)
- `GET /api/complaints` - List all complaints (Auth: Admin)
- `GET /api/complaints/:id` - Get complaint details (Auth: Any)
- `GET /api/complaints/user` - Get user's complaints (Auth: User)
- `PUT /api/complaints/:id/assign` - Assign worker (Auth: Admin)
- `PUT /api/complaints/:id/status` - Update status (Auth: Admin)
- `POST /api/complaints/:id/reject` - Reject complaint (Auth: Admin)
- `GET /api/complaints/stats` - Get statistics (Auth: Admin)
- `DELETE /api/complaints/:id` - Delete complaint (Auth: Admin)

### Workers

- `GET /api/workers` - List all workers (Auth: Admin)
- `GET /api/workers/:id` - Get worker details (Auth: Admin)
- `POST /api/workers` - Create worker (Auth: Admin)
- `PUT /api/workers/:id` - Update worker (Auth: Admin)
- `PUT /api/workers/:id/status` - Update status (Auth: Admin)
- `GET /api/workers/:id/complaints` - Get worker's complaints (Auth: Admin)

### Users

- `GET /api/users/profile` - Get current user profile (Auth: User)
- `GET /api/users` - List all users (Auth: Admin)
- `GET /api/users/:id` - Get user details (Auth: Admin)
- `GET /api/users/:id/complaints` - Get user's complaints (Auth: Admin)

### Media

- `POST /api/media/upload` - Upload image (Auth: Any)

### Analytics

- `GET /api/analytics/heatmap` - Get heatmap data (Auth: Admin)
- `GET /api/analytics/dashboard` - Get dashboard stats (Auth: Admin)
- `GET /api/analytics/trends` - Get trends data (Auth: Admin)
- `GET /api/analytics/categories` - Get category breakdown (Auth: Admin)

## Request Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "password": "password123"
  }'
```

### Submit Civic Complaint
```bash
curl -X POST http://localhost:5000/api/complaints/civic \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "category=Water Supply & Sanitation" \
  -F "subcategory=Leaking Pipes" \
  -F "description=Water pipe leaking on main road" \
  -F "address=123 Main St, City" \
  -F "latitude=28.4697" \
  -F "longitude=77.0303" \
  -F "image=@/path/to/image.jpg"
```

### Assign Worker
```bash
curl -X PUT http://localhost:5000/api/complaints/COMPLAINT_ID/assign \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"workerId": "WORKER_ID"}'
```

## Database Schema

### Users
- id (UUID, PK)
- name, email, phone
- passwordHash
- createdAt, updatedAt

### Admins
- id (UUID, PK)
- name, email
- passwordHash
- role
- createdAt, updatedAt

### Workers
- id (UUID, PK)
- name, email, phone
- status (Active/Inactive)
- assignedCount
- createdAt, updatedAt

### Complaints
- id (UUID, PK)
- type (civic/traffic)
- category, subcategory
- description, address
- latitude, longitude
- status (Pending/In-Progress/Resolved/Rejected)
- plateNumber, confidenceScore
- validationStatus
- userId (FK), workerId (FK)
- createdAt, updatedAt, resolvedAt

### Media
- id (UUID, PK)
- complaintId (FK)
- url, publicId
- type
- createdAt

### StatusHistory
- id (UUID, PK)
- complaintId (FK)
- oldStatus, newStatus
- changedBy
- timestamp

## Real-time Updates

Socket.io is integrated for real-time updates. Connect from frontend/app:

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected');
});

socket.on('complaint:created', (data) => {
  console.log('New complaint:', data);
});

socket.on('complaint:updated', (data) => {
  console.log('Complaint updated:', data);
});
```

## Error Handling

All responses follow this format:

```json
{
  "success": true/false,
  "data": {},
  "message": "Success/Error message",
  "error": null,
  "timestamp": "ISO date"
}
```

## License

MIT
