# Event Booking System - Complete Migration

This project has been successfully converted from a FastAPI + Next.js TypeScript application to an Express.js + Vite React JavaScript application.

## Project Structure

```
FYP/
├── express-api/          # Node.js Express API with MongoDB
├── vite-frontend/        # React + Vite frontend
├── fast-api-server/      # Original FastAPI (for reference)
└── nextjs-client/        # Original Next.js (for reference)
```

## 🚀 Express API Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)

### Installation

```bash
cd express-api
npm install
```

### Configuration

Create `.env` file:

```env
DATABASE_URL=mongodb://localhost:27017/event_booking
JWT_SECRET=your_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRY=3600
SERVER_BASE_URL=http://localhost:8000/
CLIENT_BASE_URL=http://localhost:3000
PORT=8000
```

### Run Server

```bash
# Development
npm run dev

# Production
npm start
```

### API Endpoints

**Auth:**

- POST `/users/signup` - Create account
- POST `/users/login` - Login
- GET `/users/logout` - Logout
- GET `/users/me` - Get current user
- GET `/users` - Get all users (admin)

**Venues:**

- GET `/venues` - Get all venues
- POST `/venues` - Create venue (admin)
- GET `/venues/:id` - Get venue
- DELETE `/venues/:id` - Delete venue (admin)
- GET `/venues/reviews/:id` - Get reviews
- POST `/venues/reviews/:id` - Create review

**Caterings:**

- GET `/caterings` - Get all caterings
- POST `/caterings` - Create catering (admin)
- DELETE `/caterings/:id` - Delete catering (admin)
- GET `/caterings/dishes` - Get all dishes
- POST `/caterings/dishes` - Create dish (admin)
- DELETE `/caterings/dishes/:id` - Delete dish (admin)

**Decorations:**

- GET `/decorations` - Get all
- POST `/decorations` - Create (admin)
- DELETE `/decorations/:id` - Delete (admin)

**Cars:**

- GET `/cars` - Get all cars
- POST `/cars` - Create car (admin)
- DELETE `/cars/:id` - Delete (admin)
- PATCH `/cars/:id` - Update car (admin)

**Promos:**

- GET `/promos` - Get all promos
- POST `/promos` - Create promo (admin)
- DELETE `/promos/:id` - Delete (admin)

**Bookings:**

- GET `/bookings` - Get all (admin)
- GET `/bookings/me` - Get my bookings
- POST `/bookings` - Create booking
- PATCH `/bookings/:id` - Update booking
- DELETE `/bookings/:id` - Delete booking

---

## 🎨 Vite Frontend Setup

### Installation

```bash
cd vite-frontend
npm install
```

### Configuration

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

### Features

**Technology Stack:**

- ⚡ Vite - Fast build tool
- ⚛️ React 18 - UI library
- 🎨 Material-UI (MUI) - Component library
- 🔄 Redux Toolkit - State management
- 🛣️ React Router v6 - Routing
- 📡 Axios - HTTP client
- 🎭 Lucide React - Icons

**Key Features:**

- JWT cookie-based authentication
- Protected routes (admin & user)
- Redux Toolkit with async thunks
- Material-UI themed components
- Image upload support
- Responsive design
- Real-time booking management

### User Credentials

**Admin:**

- Email: `daaim@shaadi.com`
- Password: `abc_123`

**Regular User:**

- Email: `daaimalisheikh23@gmail.com`
- Password: `abc_123`

### Routes

**Public Routes:**

- `/login` - Login page
- `/signup` - Signup page

**User Routes:**

- `/` - Home page with booking
- `/bookings` - My bookings

**Admin Routes:**

- `/dashboard` - Overview
- `/dashboard/bookings` - Manage bookings
- `/dashboard/venues` - Manage venues
- `/dashboard/caterings` - Manage caterings
- `/dashboard/dishes` - Manage dishes
- `/dashboard/decorations` - Manage decorations
- `/dashboard/cars` - Manage cars
- `/dashboard/promos` - Manage promos

---

## 🔄 Migration Summary

### Backend Changes

- ✅ FastAPI → Express.js
- ✅ PostgreSQL/SQLModel → MongoDB/Mongoose
- ✅ Async/await Python → Node.js callbacks
- ✅ Pydantic → Native JavaScript validation
- ✅ Alembic migrations → MongoDB schema-less

### Frontend Changes

- ✅ Next.js → Vite + React
- ✅ TypeScript → JavaScript
- ✅ Zustand → Redux Toolkit
- ✅ React Query → Redux Thunks
- ✅ React Hook Form → Native forms
- ✅ Zod validation → Custom validation
- ✅ Next Router → React Router v6

### Preserved Features

- ✅ JWT authentication with cookies
- ✅ Image upload functionality
- ✅ Admin/user role management
- ✅ All CRUD operations
- ✅ Booking system with payment
- ✅ Promo codes
- ✅ Car reservations
- ✅ Venue reviews
- ✅ Material-UI theming

---

## 📦 Dependencies

### Express API

```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "cookie-parser": "^1.4.6",
  "dotenv": "^16.3.1",
  "multer": "^1.4.5-lts.1",
  "uuid": "^9.0.1",
  "cors": "^2.8.5"
}
```

### Vite Frontend

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "@reduxjs/toolkit": "^2.0.1",
  "react-redux": "^9.0.4",
  "@mui/material": "^5.15.0",
  "@emotion/react": "^11.11.1",
  "@emotion/styled": "^11.11.0",
  "@mui/icons-material": "^5.15.0",
  "axios": "^1.6.2",
  "lucide-react": "^0.294.0"
}
```

---

## 🐛 Troubleshooting

**MongoDB Connection Issues:**

```bash
# Make sure MongoDB is running
mongod

# Or use MongoDB Atlas cloud connection string
```

**CORS Errors:**

- Ensure `CLIENT_BASE_URL` in Express API .env matches frontend URL
- Check cookies are enabled in browser

**Image Upload Issues:**

- Verify `images/` directory exists in express-api
- Check file permissions

**Port Conflicts:**

- Backend: Change PORT in .env
- Frontend: Change port in vite.config.js

---

## 📝 Notes

- All routes maintain the same endpoint structure as the original FastAPI
- Frontend uses the same MUI theme and styling
- Redux slices are organized by feature (auth, venues, bookings, etc.)
- Image uploads use Multer with UUID filenames
- MongoDB ObjectIds replace PostgreSQL UUIDs but are referenced as `_id`

---

## 🎯 Next Steps

1. Install dependencies for both projects
2. Set up MongoDB database
3. Configure environment variables
4. Run Express API
5. Run Vite frontend
6. Test with provided credentials
7. Explore admin and user features

---

**Migration completed successfully! 🎉**
