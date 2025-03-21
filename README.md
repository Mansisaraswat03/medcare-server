# Doctor Appointment System - Backend

A Node.js backend service for managing doctor appointments, built with Express, PostgreSQL, Auth0, and Firebase Cloud Messaging.

## Features

- User authentication with Auth0
- Doctor profile management
- Appointment booking and management
- Real-time notifications using Firebase Cloud Messaging
- Role-based access control (Admin, Doctor, Patient)
- Search and filter doctors by specialty, location, rating
- Appointment scheduling with availability checks

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Auth0 account
- Firebase project with Cloud Messaging enabled

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd appointment-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your configuration:
```env
# Copy from .env.example and fill in your values
cp .env.example .env
```

4. Set up the database:
```bash
# Create a PostgreSQL database
createdb doctor_appointment_db

# The tables will be automatically created when you start the server
```

5. Start the development server:
```bash
npm run dev
```

The server will start on http://localhost:8000

## API Documentation

### Authentication
All API endpoints require authentication using Auth0. Include the Bearer token in the Authorization header:
```
Authorization: Bearer <your-auth0-token>
```

### Endpoints

#### Users
- `POST /api/users/register` - Register a user
- `POST /api/users/login` - Login app

## Frontend Integration

The backend is configured to work with a frontend running on `http://localhost:3000`. To connect your frontend:

1. Ensure your frontend is running on port 3000
2. Use the provided API endpoints with proper authentication
3. For real-time notifications, implement FCM in your frontend and update the FCM token using the `/api/users/fcm-token` endpoint

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security

- All endpoints are protected with Auth0 authentication
- CORS is configured to allow only the frontend origin
- Rate limiting is implemented to prevent abuse
- Helmet is used for security headers
- Input validation and sanitization
- Role-based access control
