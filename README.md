Node.js CRUD API with MSSQL
📋 Project Overview

This project is a simple CRUD (Create, Read, Update, Delete) API built using Node.js, Express, and Microsoft SQL Server (MSSQL).
It demonstrates how to design a clean, modular backend with proper configuration, controllers, and routes — ideal for beginners and technical evaluations.

🏗️ Tech Stack
Layer Technology
Backend Framework Node.js (Express.js)
Database Microsoft SQL Server
ORM / DB Driver mssql package
Environment Config dotenv
Validation Basic input validation

📂 Project Structure
nodejs-crud-mssql/
├── config/
│ └── db.js # Database connection setup
├── controllers/
│ └── userController.js # Handles user CRUD logic
├── models/
│ └── userModel.js # SQL queries or ORM models
├── routes/
│ └── userRoutes.js # All user-related endpoints
├── app.js # Application entry point
├── package.json # Dependencies and scripts
└── .env # Environment variables (not committed)

⚙️ Environment Variables

Create a .env file in your project root and add:

PORT=3000
DB_USER=your_sql_username
DB_PASSWORD=your_sql_password
DB_SERVER=localhost
DB_DATABASE=your_database_name

🧑‍💻 Installation & Setup

Clone the repository

git clone https://github.com/surajpsharma/nodejs-crud-mssql.git

cd nodejs-crud-mssql

Install dependencies
npm install

🧰 Scripts
Command Description
npm start -Run the server
npm run dev -Run server with nodemon (for development)

🏁 Author

Suraj Sharma
📧 surajpsharma

💻 GitHub Profile
