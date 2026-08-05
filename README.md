# 🏛️ SchemeSaathi – Centralized Government Scheme Portal & AI Assistant

[![Live Frontend](https://img.shields.io/badge/Status-Live%20Frontend-success?style=for-the-badge&logo=vercel)](https://your-frontend-link.vercel.app)
[![Live Backend](https://img.shields.io/badge/Backend-Render-purple?style=for-the-badge&logo=render)](https://gov-scheme-portal.onrender.com)
[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=mongodb)](https://github.com/SanjayGhosh93/gov-scheme-portal)

> **SchemeSaathi** is a comprehensive full-stack platform designed to bridge the gap between citizens and government welfare schemes. It features a centralized portal with advanced category filters and an integrated database-driven AI chatbot to instantly help users discover schemes tailored to their needs.

---

## 🌟 Key Features

*   **🔍 Centralized Scheme Explorer:** Browse through a rich collection of government schemes categorized by Agriculture, Education, Health, Women Empowerment, and more.
*   **🤖 Saathi AI Assistant:** An intelligent, database-driven chatbot built to answer user queries in real-time, matching natural language prompts directly to relevant government schemes.
*   **📍 State & Category Filtering:** Seamlessly filter schemes based on geographical states and specific socio-economic sectors.
*   **🔐 Secure Authentication:** Robust user registration and authentication workflows protecting user profiles and data.
*   **🛠️ Admin Management Panel:** Dedicated interface for administrators to add, manage, and update scheme listings dynamically.

---

## 🛠️ Tech Stack

*   **Frontend:** React.js (Vite), Tailwind CSS / Modern CSS, JavaScript
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB Atlas, Mongoose ODM
*   **Deployment:** Vercel (Frontend) & Render (Backend)

---

## 🚀 Live Demo & Links

*   **Frontend Web App:** [View Live Website](https://your-frontend-link.vercel.app) *(Replace with your Vercel link)*
*   **Backend API Root:** [Check API Status](https://gov-scheme-portal.onrender.com)

---

## 📂 Project Architecture

```text
gov-scheme-portal/
├── backend/
│   ├── models/        # Mongoose Schemas (Scheme, User, etc.)
│   ├── routes/        # Express API Endpoints (Auth, Schemes, AI Chat)
│   └── server.js      # Main Express Application & Database Connection
└── frontend/
    ├── public/        # Static Assets
    └── src/
        ├── components/ # UI Components (AdminPanel, Chatbot, Cards, etc.)
        ├── App.jsx     # Main React Root Component
        └── main.jsx    # Application Entry Point
