# 🏢 BuildSync – My Full-Stack SaaS Project

BuildSync is a building management system that I built to simulate a **real-world SaaS product** used in residential societies.

The goal was not just to build features, but to **understand how production systems are designed, built, and deployed**.

---

## 🚀 Live Demo

🔗 Frontend: https://buildsync-zeta.vercel.app/
🔗 Backend: https://buildsync-backend.onrender.com

---

## 🧠 Why I Built This

In many residential buildings, managing complaints, staff, and communication is inefficient and manual.

I wanted to build a system where:

* Residents can raise issues easily
* Managers can manage operations efficiently
* Staff can be assigned and tracked
* Everything works in a structured, role-based system

---

## ✨ What It Does

### 🔐 Authentication System

* Secure login using JWT
* Role-based access (Admin, Manager, Resident, Staff)

---

### 👥 User Approval Flow (Core Feature)

* Admin approves Managers
* Managers approve Residents & Staff
* Users remain in a **pending state** until approved

---

### 🏢 Building & Flat System

* Create buildings
* Add flats
* Assign residents to flats

---

### 🛠 Complaint System

* Residents raise complaints
* Managers/Admins:

  * View all complaints
  * Assign staff
  * Update status

---

### ⚡ Real-Time Updates

* Integrated Socket.IO for live complaint updates

---

### 🖼 Profile System

* Upload profile pictures via Cloudinary

---

## 🏗 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Redux Toolkit

### Backend

* Node.js + Express
* MongoDB (Mongoose)
* JWT Authentication
* Socket.IO

### Deployment

* Vercel (Frontend)
* Render (Backend)
* MongoDB Atlas (Database)

---

## ⚙️ How to Run Locally

```id="1lf2rj"
git clone https://github.com/Yashasvi-14/buildsync.git
cd buildsync
```

### Backend

```id="x6x8mg"
cd backend
npm install
npm run dev
```

### Frontend

```id="tk9l9b"
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend

```id="2g6qf7"
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=
CLOUDINARY_*
```

### Frontend

```id="e4d8y3"
VITE_API_URL=
```

---

## 🚧 Current Limitations

* UI is functional but not fully polished
* No payment system yet
* No notification/email system

---

## 📈 What I Plan to Add Next

* 💳 Stripe payment integration
* 🔔 Notification system
* 💬 Real-time chat
* 📊 Dashboard analytics
* 🎨 UI/UX improvements

---

## 🧠 What I Learned

This project helped me understand:

* How to design role-based systems
* How real backend APIs are structured
* Handling authentication securely
* Debugging real deployment issues (CORS, routing, env variables)
* Connecting frontend and backend in production

---

## 👨‍💻 About Me

I’m currently pursuing Electrical Engineering at DTU and actively building projects to strengthen my development and problem-solving skills.

---

⭐ If you checked this out, feel free to star the repo!
