# 🇮🇳 SchemeSaathi AI

> **An AI-Powered Government Welfare Scheme Discovery & Eligibility Platform**

![React](https://img.shields.io/badge/React-19-blue)
![Node](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success)
![Gemini](https://img.shields.io/badge/Gemini-AI-orange)
![JWT](https://img.shields.io/badge/Auth-JWT-red)

---

# 📌 Problem Statement

Millions of Indian citizens remain unaware of Central and State Government welfare schemes because information is scattered across multiple websites.

People often struggle to

- Find relevant schemes
- Check eligibility
- Understand benefits
- Access official application links
- Read information in their own language

SchemeSaathi solves this problem through an AI-powered unified portal.

---

# 💡 Solution

SchemeSaathi is a centralized platform that allows citizens to

- Discover government schemes
- Search by category
- Filter by state
- Check eligibility instantly
- Chat with an AI assistant
- Save favourite schemes
- Access official application portals
- Browse in multiple languages

---

# 🚀 Features

## 🏠 Home

- Modern landing page
- Trending government schemes
- Popular categories
- Quick navigation
- Responsive UI

---

## 🔍 Smart Scheme Search

Users can search schemes using

- Scheme Name
- Category
- State
- Keywords

Real-time filtering makes discovery simple.

---

## 📑 Categories

- Education
- Health
- Agriculture
- Women
- Employment
- Housing
- Senior Citizens

---

## 🤖 AI Assistant

Gemini-powered chatbot that answers

- Explain this scheme
- Am I eligible?
- Required documents
- Benefits
- Application process

---

## ✅ Eligibility Checker

Users enter

- State
- Category
- Annual Income

The platform recommends matching schemes from MongoDB.

---

## ❤️ Favourite Schemes

Users can

- Save schemes
- Remove favourites
- Quickly revisit later

---

## 🔐 Authentication

- Register
- Login
- JWT Authentication
- Secure Password Storage

---

## 🌐 Multi-language Support

Supports multiple languages for better accessibility.

---

## 👨‍💼 Admin Dashboard

Admin can

- View Analytics
- Add Schemes
- Manage Schemes
- Manage Users

---

## 📊 Analytics

Dashboard displays

- Total Schemes
- Registered Users
- Daily Searches
- Match Accuracy

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios

---

## Backend

- Node.js
- Express.js

---

## Database

MongoDB Atlas

---

## Authentication

JWT

---

## AI

Google Gemini API

---

## Deployment

Frontend → Vercel

Backend → Render

Database → MongoDB Atlas

---

# 📂 Project Structure

```

SCHEMESAATHI/
│
├── backend/
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Scheme.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── schemeRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   ├── CategoryGrid.jsx
│   │   │   ├── FloatingAIChatbot.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── IndiaMapFilter.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── SchemeCard.jsx
│   │   │   └── Testimonials.jsx
│   │   │
│   │   ├── context/
│   │   │   └── LanguageContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── SchemesPage.jsx
│   │   │   ├── EligibilityChecker.jsx
│   │   │   └── Favourites.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── README.md
│   └── .gitignore
│
└── README.md

---

# 🗄 Database Collections

## Users

```
name

email

password

role
```

---

## Schemes

```
title

description

category

state

benefits

eligibility

documents

officialLink
```

---

# APIs

```
POST /register

POST /login

GET /schemes

POST /scheme

PUT /scheme/:id

DELETE /scheme/:id

POST /eligibility

POST /chat
```

---

# Security

- JWT Authentication
- Protected Admin Routes
- MongoDB Atlas
- Environment Variables
- Password Hashing

---

# Future Scope

- Voice Assistant
- OCR Document Verification
- Aadhaar Verification
- DigiLocker Integration
- AI Recommendation Engine
- Mobile App
- Offline Support
- SMS Notifications

---

# Impact

SchemeSaathi helps citizens

✅ Discover schemes easily

✅ Reduce misinformation

✅ Improve digital accessibility

✅ Increase awareness

✅ Save time

✅ Encourage digital governance

---

# Why SchemeSaathi?

Instead of searching dozens of government websites, citizens receive everything in one platform with AI-powered assistance.

---

# Team

 Syntax Squad

Project

SchemeSaathi AI

Made with ❤️ using React, Node.js, Express, MongoDB & Gemini AI.
