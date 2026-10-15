# OneTap 🔧  
*A role-based service request platform connecting vehicle owners with mechanics.*

---

## 📌 Overview

**OneTap** is a full-stack web application that connects vehicle owners with nearby mechanics for vehicle servicing, repairs, and roadside assistance.

The platform is designed around a **simple request-based workflow**, where:
- Users raise service requests
- Mechanics accept or reject requests based on availability
- Both parties can track request status clearly

The primary goal of OneTap is to solve **real-world coordination problems**, not to overcomplicate the system with unnecessary features.

---

## 🎯 Problem Statement

During vehicle breakdowns, users often face:
- Difficulty finding reliable mechanics quickly
- Lack of transparency in service availability
- Poor communication and status tracking

OneTap addresses these issues by providing:
- A structured service request lifecycle
- Role-based access control
- Clear ownership of actions and state transitions

---

## 🚀 Key Features

### 👥 Role-Based Authentication
- Separate authentication flows for:
  - Vehicle owners (users)
  - Mechanics
- JWT-based authentication
- Protected routes based on user roles

---

### 🛠️ Service Request Lifecycle
- Users can create service requests
- Mechanics can:
  - Accept requests
  - Reject requests if unavailable
- Requests move through clearly defined states:
  - Created → Accepted / Rejected

This ensures predictable system behavior and prevents conflicting actions.

---

### 📬 User Communication & Security
- Email verification during signup
- Password reset via email
- Secure REST APIs for all operations

---

### 👨‍🔧 Mechanic Management
- Mechanic profiles with availability status
- Controlled access to incoming requests
- Ability to manage active and completed jobs

---

## 🧠 System Design Highlights

- **Role-based access control (RBAC)**  
  Prevents unauthorized actions across user types.

- **State-driven request handling**  
  Each service request follows a strict lifecycle.

- **Backend-first validation**  
  All critical checks are enforced server-side.

- **Scalable API design**  
  Easily extendable for real-time updates or geo-based discovery.

---

## 🛠 Tech Stack

### Frontend
- React
- Tailwind CSS
- Axios
- Zustand (state management)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Resend

## ⚠️ Edge Cases Considered

- Unauthorized access attempts
- Duplicate request submissions
- Mechanics accepting multiple requests simultaneously
- Invalid role-based actions

---

## 🧪 Future Improvements

- Location-based mechanic discovery (geospatial queries)
- Real-time request updates using WebSockets
- Ratings and reviews for mechanics
- Admin dashboard for moderation
- Notification support (email / push)

---

## 🧠 What I Learned

- Designing role-based backend systems
- Managing state transitions safely
- Structuring scalable REST APIs
- Handling real-world user workflows
- Implementing secure authentication flows

---

## 📄 Disclaimer

This project is built for **learning and demonstration purposes** and does not currently process payments.

---

## 👨‍💻 Author

Built by **Piyush Sharma**  
Software Engineering Student | Full-Stack Developer

---

⭐ If you find this project useful, feel free to star the repository!
