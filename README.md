# Crimify: Advanced Crime Data Analysis Platform

Crimify is a full-stack Big Data Analytics (BDA) system designed to analyze urban crime patterns using modern web technologies and machine learning.

## 🚀 Features

- **Intelligence Dashboard**: Real-time stats, trends, and category distribution.
- **AI Analytics**: Predictive forecasting (Linear Regression) and Spatial Hotspot Detection (DBSCAN Clustering).
- **Interactive Map**: Spatial visualization of crime incidents using Leaflet.
- **Crime Ledger**: Advanced filtering, search, and CSV dataset management.
- **Secure Auth**: JWT-based authentication with Role-Based Access Control (Admin/User).
- **Modern UI**: Dark-themed, high-performance interface with Glassmorphism and smooth animations.

## 🛠 Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Recharts, Leaflet.
- **Backend**: Node.js, Express.js, MongoDB + Mongoose.
- **ML Engine**: Python, Scikit-learn, Pandas.
- **Security**: JWT, bcrypt, Helmet.

## 🏗 Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on port 27017 or Atlas URI)
- Python 3.x (For AI features)

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file with your MONGO_URI and JWT_SECRET
npm run seed  # Generates 5000 realistic crime records and admin user
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. ML Setup (Optional, for AI Insights)
```bash
cd ml-models
pip install -r requirements.txt
```

## 🔑 Default Credentials
- **Admin**: `admin@crimedata.com`
- **Password**: `password123`

## 📂 Project Structure
- `/frontend`: React application source code.
- `/backend`: Node.js server, controllers, and models.
- `/ml-models`: Python scripts for clustering and predictions.
- `/datasets`: Sample CSV datasets for bulk upload testing.

## 🛡 Security
Implemented security headers via Helmet, CORS protection, JWT-based route protection, and hashed passwords using bcrypt.

## 📊 AI/ML Implementation
- **Clustering**: Uses DBSCAN (Density-Based Spatial Clustering of Applications with Noise) to identify high-density crime hotspots without pre-defining the number of clusters.
- **Prediction**: Uses Linear Regression on time-series aggregated data to forecast monthly crime occurrences.
