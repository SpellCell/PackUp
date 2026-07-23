# 🌍 PackUP

PackUP is a modern full-stack travel collaboration platform that helps groups plan, organize, and enjoy trips together.

Instead of juggling multiple apps for chats, expenses, locations, and media sharing, PackUP brings everything into one platform.

---

## ✨ Features

### 🔐 Authentication
- User Registration
- Email Verification
- Secure Login
- JWT Authentication
- Password Reset
- Protected Routes

### 🧳 Trip Management
- Create Trips
- Edit Trips
- Delete Trips
- Upload Cover Images
- Trip Categories
- Trip Status
- Participant Management

### 🎟 Trip Code System
- Auto-generated unique Trip Codes
- Join trips using Trip Code
- Secure Join Requests
- Organizer Approval
- Participant Access Control

### 💬 Real-time Chat
- Socket.IO powered messaging
- Trip-specific chat rooms
- Typing Indicators
- Message History
- Persistent Database Storage

### 👥 Collaboration
- Join Requests
- Organizer Dashboard
- Accept / Reject Requests
- Member Management

### 🚧 Upcoming Features
- Expense Splitting
- Live Location Sharing
- Photo & Video Sharing
- Voice Notes
- Notifications
- Trip Timeline
- Offline Support

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Axios
- Socket.IO Client
- React Hot Toast
- Lucide Icons

---

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Socket.IO
- JWT
- Bcrypt
- Multer
- Cloudinary
- Nodemailer

---

# 📂 Project Structure

```
PackUP
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── src
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/PackUP.git
```

---

## Install Client

```bash
cd client
npm install
```

---

## Install Server

```bash
cd ../server
npm install
```

---

## Environment Variables

Create a `.env` file inside the **server** folder.

Example:

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

JWT_EXPIRE=7d

EMAIL_USER=

EMAIL_PASS=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

CLIENT_URL=http://localhost:5173
```

---

## Start Backend

```bash
cd server
npm run dev
```

---

## Start Frontend

```bash
cd client
npm run dev
```

---

# 📡 API Overview

## Authentication

- Register
- Verify Email
- Login
- Logout
- Forgot Password
- Reset Password

---

## Trips

- Create Trip
- Update Trip
- Delete Trip
- Explore Trips
- My Trips

---

## Join Requests

- Send Join Request
- Pending Requests
- Accept Request
- Reject Request

---

## Chat

- Trip Chat
- Real-time Messaging
- Message History

---

# 📌 Current Development Status

✅ Authentication

✅ Trip Management

✅ Trip Code System

✅ Join Requests

✅ Real-time Chat

🚧 Expense Splitting

🚧 Live Location

🚧 Media Sharing

🚧 Notifications

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Vipul Raj**

B.Tech CSE Student

GLA University

India