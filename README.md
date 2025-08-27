# 🏢 Job Portal with ML-Based Recommendation (Flask + React)

A **full-stack Job Portal** built with **Flask (backend)**, **React (frontend)**, and **MySQL (database)**.  
It supports **role-based authentication** (Admin/User), **CRUD operations on jobs**, and an **AI-powered job recommendation system** using **NLP and cosine similarity**.

---

## 🚀 Features

### 🔑 Authentication
- User registration & login (via UI).
- Admin registration only via **Postman (or database)** for security.
- JWT-based authentication (secure login with tokens).

### 👨‍💼 Admin
- Login from UI using admin credentials.
- Add, Edit, Delete jobs via dashboard (CRUD).
- Only admin can manage job postings.

### 🙍 User
- Register & login via UI.
- Role is always set as `user` when registering from frontend.
- View all jobs.
- Use **ML-powered recommendation system** to get job suggestions based on skills.

### 🤖 Machine Learning Model
- `JobMatcher` ML module uses **TF-IDF (Term Frequency – Inverse Document Frequency) vectorization + Cosine   Similarity**.
- Users enter their skills → ML recommends top relevant jobs from database.

---

## 🛠️ Tech Stack

**Frontend (React + Tailwind)**  
- React (Hooks, Axios)  
- TailwindCSS 

**Backend (Flask)**  
- Flask + Flask-SQLAlchemy  
- JWT Authentication  
- REST APIs  
- ML model (`JobMatcher`)  

**Database**  
- MySQL (Admin/User storage, Jobs storage)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone repo
```bash
git clone https://github.com/yunusbutt676-commits/Flask-React.git
cd Flask-React
cd frontend
