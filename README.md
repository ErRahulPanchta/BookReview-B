# Book Review Platform

This is a Full Stack Book Review Application built using:

- React (Frontend)
- Node.js + Express (Backend)
- MongoDB (Database)
- Multer (for image uploads)
- JWT (Authentication)

---

## Folder Structure

root/
│
├── client/ # React Frontend
├── backend/ # Node.js Backend
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── uploads/ # Uploaded book cover images
│ └── server.js

yaml
Copy
Edit


---

## Prerequisites

- Node.js and npm
- MongoDB Atlas account or local MongoDB server
- Postman for API testing

---

## Environment Variables

Create a `.env` file inside the `backend/` folder:

PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173


---

## Installation and Running

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bookreview-platform.git
cd bookreview-platform

cd backend
npm install

cd ../client
npm install

cd ../backend
npm run dev

cd ../client
npm run dev

Project Features
User Authentication (JWT)

Role-based Access (Admin)

Add/View Books with Cover Images

Pagination

Search Functionality

Review & Ratings

Responsive UI