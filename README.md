# Intelligent Adaptive Learning and Academic Planning System

An AI-powered personalized learning platform designed to help students improve their academic performance through personalized learning, AI-assisted tutoring, quizzes, study planning, and progress tracking.

## Project Overview

The Intelligent Adaptive Learning and Academic Planning System is a web-based application that uses Artificial Intelligence to provide students with personalized academic assistance.

The system collects student information such as department, semester, academic goals, subjects, weak areas, study hours, and learning preferences. Based on this information, the platform provides personalized learning support and academic planning.

## Objectives

- Provide personalized learning assistance to students.
- Offer an AI-powered tutor for academic queries.
- Generate personalized study plans.
- Identify and work on weak subjects.
- Provide quizzes for self-assessment.
- Track student learning progress.
- Maintain student profiles and academic goals.
- Improve learning efficiency through AI-based recommendations.

## Key Features

### Student Authentication

- Student registration and login.
- JWT-based authentication.
- Secure session handling.
- Logout functionality.

### Student Onboarding and Profile

Students can provide:

- Department
- Semester
- Subjects
- Weak subjects
- Academic goal
- Daily study hours
- Available study time
- Learning preferences

The profile information is stored in MongoDB and can be updated later.

### AI Tutor

The AI Tutor uses the Google Gemini API to provide AI-assisted academic support.

Students can:

- Ask academic questions.
- Receive explanations.
- Get learning guidance.
- Interact with the AI for personalized assistance.

### Study Planner

The Study Planner helps students organize their learning schedule based on their academic information and available study time.

### Quiz Module

The Quiz module allows students to test their understanding of subjects through quizzes and evaluate their performance.

### Progress Tracking

The Progress module helps students monitor their academic progress and understand their performance over time.

### Personalized Dashboard

The dashboard provides students with an overview of their:

- Academic goal
- Semester and department
- Learning activities
- Study planning
- Quiz performance
- Progress

## AI-Based Architecture

The system follows an agent-based architecture where a coordinator layer manages different AI-powered learning functions.

```text
                         Student
                            |
                            v
                    React Frontend
                            |
                            v
                   Node.js / Express
                            |
                            v
                    Coordinator Agent
                     /      |      \
                    /       |       \
                   v        v        v
              AI Tutor    Quiz    Study Planner
                    \       |       /
                     \      |      /
                      v     v     v
                    Progress Tracking
                            |
                            v
                         MongoDB
```

## Technologies Used

### Frontend

- React
- Vite
- JavaScript
- Axios
- React Router
- Tailwind CSS

### Backend

- Node.js
- Express.js
- JavaScript
- Mongoose
- JWT
- Axios

### Database

- MongoDB

### Artificial Intelligence

- Google Gemini API

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman

## Project Structure

```text
AI-Learning-System/
|
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- utils/
|   `-- package.json
|
|-- server/
|   |-- controllers/
|   |-- models/
|   |-- routes/
|   `-- package.json
|
|-- .gitignore
|-- .env.example
|-- package-lock.json
`-- README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Bhavya-7869/Intelligent-Adaptive-Learning-and-Academic-Planning-System-.git
```

### 2. Navigate to the Project

```bash
cd AI-Learning-System
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
```

### 4. Install Backend Dependencies

Open another terminal and run:

```bash
cd server
npm install
```

### 5. Configure Environment Variables

Create a `.env` file inside the `server` directory.

Add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Never commit the actual `.env` file or API keys to GitHub.

### 6. Start the Backend

Inside the `server` directory:

```bash
npm start
```

### 7. Start the Frontend

Inside the `client` directory:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Security

Sensitive configuration values are stored using environment variables.

The repository excludes:

- `.env` files
- API keys
- Database credentials
- JWT secrets
- `node_modules`
- Build files
- Generated uploads

## Future Enhancements

- Advanced performance analytics.
- More sophisticated adaptive learning recommendations.
- Integration with additional educational datasets.
- Voice-based AI tutoring.
- Mobile application support.
- More advanced AI-generated study plans.
- Notifications and reminders.
- Faculty/instructor dashboards.

## Project

**Intelligent Adaptive Learning and Academic Planning System**

Developed as an academic major project using the MERN stack and Artificial Intelligence.