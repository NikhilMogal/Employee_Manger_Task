

Overview
The Employee Dashboard is a web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides employees with a personal dashboard displaying their profile information, including personal details, department information, and salary details.

Features
User authentication using JWT.
Fetching user data from a backend REST API.
Responsive and professional UI using Tailwind CSS.
Displays personal details (name, email, gender, hobbies).
Displays department details (department name, category, location, salary).

Technologies Used
Frontend:
React.js (Functional components)
Tailwind CSS (Responsive UI design)
Axios (API calls)

Backend:
Node.js & Express.js (REST API)
MongoDB & Mongoose (Database management)
JSON Web Token (JWT) (Authentication)

Install Dependencies

Backend

cd backend
npm install

Frontend

cd frontend
npm install

Setup Environment Variables

Create a .env file in the backend directory and add:

JWT_SECRET=your_jwt_secret_key

Running the Application

Start the Backend Server

cd backend
nodemon server.js

Start the Frontend Server
cd frontend
npm run dev


