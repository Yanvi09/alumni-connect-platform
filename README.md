# Alumni Connect Platform

A full-stack Alumni Networking Platform built using the MERN ecosystem to help alumni and students connect through mentorship, messaging, jobs, and events.

---

# Features

## Authentication

* Alumni registration and login
* Admin approval system
* Protected routes
* Persistent authentication using cookies

## Dashboard

* Personalized alumni dashboard
* Quick access to mentorships, jobs, events, and directory

## Alumni Directory

* Search alumni by:

  * Name
  * Company
  * Role
  * Location
* Filter alumni using dropdown filters
* View alumni profiles

## Messaging System

* Start conversations with alumni
* Real-time messaging support
* Persistent conversation history

## Mentorship

* View available mentors
* Request mentorship sessions
* Upcoming mentorship sessions display

## Events

* Browse upcoming events
* Register for events
* View registered events

## Jobs Portal

* Post jobs
* Browse job opportunities
* Protected authenticated access

## Admin Panel

* Approve/reject alumni registrations
* Manage jobs, events, and mentorship sessions
* Platform moderation

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* React Router
* Framer Motion

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.IO

## Deployment

* Frontend: Netlify
* Backend: Render
* Database: MongoDB Atlas

---

# Folder Structure

```bash
client/
  src/
    components/
    pages/
    context/
    lib/
    hooks/

server/
  routes/
  middleware/
  models/
  seed/
```

---

# Environment Variables

## Frontend `.env`

```env
VITE_API_URL=https://your-render-backend-url.onrender.com
```

## Backend `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_ORIGIN=https://your-netlify-url.netlify.app
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Yanvi09/alumni-connect-platform.git
```

---

# Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Backend Setup

```bash
cd server
npm install
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Production Deployment

## Frontend Deployment (Netlify)

Build Command:

```bash
npm run build
```

Publish Directory:

```bash
dist
```

---

## Backend Deployment (Render)

Build Command:

```bash
npm install
```

Start Command:

```bash
npm start
```

---

# Authentication Notes

* Authentication uses secure cookie-based sessions
* Protected APIs require:

```js
credentials: 'include'
```

* CORS configured for:

  * Localhost
  * Netlify frontend
  * Render backend

---

# API Routes

## Auth

* `/api/auth/register`
* `/api/auth/login`
* `/api/auth/logout`
* `/api/auth/me`

## Alumni

* `/api/alumni`

## Messages

* `/api/messages`

## Sessions

* `/api/sessions`

## Events

* `/api/events`

## Jobs

* `/api/jobs`

## Admin

* `/api/admin`

---

# Screens Included

* Dashboard
* Alumni Directory
* Messaging
* Mentorship
* Events
* Jobs Portal
* Admin Panel

---

# Future Improvements

* Video calling
* AI mentorship matching
* Notifications system
* Resume uploads
* Alumni analytics dashboard
* Mobile responsive enhancements

---

# Author

## Anvi

Computer Science Student | Full Stack Developer

GitHub:
https://github.com/Yanvi09

---

# License

This project is built for educational and portfolio purposes.
