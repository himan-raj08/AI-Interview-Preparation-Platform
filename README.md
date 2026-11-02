# AI Interview Preparation Platform

An AI-powered interview preparation platform built using the MERN stack. It helps users prepare for technical interviews by generating personalized interview questions and interview reports based on their resume and target job description.

## Features

* User Registration and Login
* Resume-based interview preparation
* Job Description-based question generation
* AI-powered interview report generation
* Personalized interview feedback
* Interview report history
* Protected routes and authentication

## Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* SCSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### AI Integration

* Google Gemini API

## Project Structure

```text
Full_StackAI/
│
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   └── interview/
│   │   └── services/
│   └── package.json
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── services/
│
├── server.js
├── package.json
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/himan-raj08/AI-Interview-Preparation-Platform.git

cd AI-Interview-Preparation-Platform
```

### 2. Backend Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the root directory and configure the required environment variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm start
```

### 3. Frontend Setup

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

Open the local URL provided by Vite in your browser.

## Future Improvements

* Real-time mock interview sessions
* Voice-based interview practice
* More detailed performance analytics
* Improved interview feedback and recommendations

## Author

**Himanshu Raj**
Computer Science and Engineering
BIT Patna
