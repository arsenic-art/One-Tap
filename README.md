# OneTap 🔧

OneTap is a full-stack web application that connects vehicle owners with nearby mechanics for servicing, repairs, and emergency roadside assistance.  
It provides a simple request-based flow where users can raise service requests and mechanics can accept or reject them based on availability.

---

## Description

The platform focuses on solving real-world problems around vehicle breakdowns by:
- Reducing the time to find a reliable mechanic
- Providing clear request status tracking
- Enabling secure communication between users and mechanics

OneTap follows a role-based architecture with separate access control for users and mechanics, ensuring secure and scalable request handling.

---

## Tech Stack

**Frontend**
- React
- Tailwind CSS
- Axios
- Zustand

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Nodemailer

---

## Key Features

- User & mechanic authentication
- Role-based protected routes
- Service request lifecycle (create, accept, reject)
- Email verification & password reset
- Mechanic profile and availability management
- Secure REST APIs

## Future Goals

- Implement location-based mechanic discovery using geospatial queries
- Add real-time request updates using WebSockets
- Add ratings and reviews for mechanics
- Build an admin dashboard for platform moderation
- Improve frontend UX and responsiveness
- Add notification support (email / push)
