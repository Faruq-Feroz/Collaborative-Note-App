# 🎉 **Collaborative Note App**

## 🚀 Live Demo
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https:)

### 🏠 Home Screenshot  
[![Home Screenshot](/frontend/src/assets/Home.png)](https:)

---

✍️ **_A collaborative real-time note-taking application that allows users to join rooms, create, update, and manage notes, all powered by a REST API and WebSockets._**

## 📌 Table of Contents
- [✨ Features](#features)
- [🛠 Tech Stack](#tech-stack)
- [📦 Backend Setup](#backend-setup)
- [💻 Frontend Setup](#frontend-setup)
- [🔗 API Endpoints](#api-endpoints)
- [📡 WebSocket Events](#websocket-events)
- [📁 Project Structure](#project-structure)
- [📸 Screenshots](#screenshots)
- [🔮 Future Implementations](#future-implementations)
- [📜 License](#license)

---

## ✨ Features
✅ **Real-time collaboration** with WebSockets  
✅ **Create and manage notes** in different rooms  
✅ **REST API** for note operations  
✅ **User notifications** when someone joins or leaves a room  
✅ **Responsive UI** built with React  
✅ **Toast notifications** for a smooth user experience  
✅ **Optimized backend** using Express.js  
✅ **Modern animations** with Framer Motion  

---

## 🛠 Tech Stack
### 🔙 Backend
- 🟢 **Node.js**
- ⚡ **Express.js**
- 🍃 **MongoDB + Mongoose**
- 🔄 **Socket.io**
- 🔐 **dotenv** (Environment Variables)

### 💻 Frontend
- ⚛️ **React.js**
- 🌎 **React Router**
- 🔗 **Axios**
- 🔔 **React Toastify**
- 📡 **Socket.io Client**
- 🎭 **Framer Motion**
- 🎨 **Lucide Icons**

---

## 📦 Backend Setup

### 🔧 Prerequisites
Ensure you have **Node.js** and **MongoDB** installed.

### 📥 Installation
```bash
cd backend
npm install
```

### 📝 Environment Variables
Create a `.env` file in the backend folder and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### ▶️ Running the Server
```bash
nodemon server
```
📍 The backend should now be running at `http://localhost:5000`.

---

## 💻 Frontend Setup

### 🔧 Prerequisites
Ensure **Node.js** is installed.

### 📥 Installation
```bash
cd frontend
npm install
```

### 📝 Environment Variables
Create a `.env` file in the frontend folder and add:
```env
VITE_API_URL=http://localhost:5000
```

### ▶️ Running the Frontend
```bash
npm run dev
```
📍 The frontend should now be running at `http://localhost:5173`.

---

## 🔗 API Endpoints
### 📝 Notes
| 🛠 Method | 🔗 Endpoint           | 📌 Description              |
|----------|----------------------|----------------------------|
| GET      | `/api/notes/:roomId` | Get all notes in a room    |
| POST     | `/api/notes`         | Create a new note         |
| PUT      | `/api/notes/:id`     | Update a note            |
| DELETE   | `/api/notes/:id`     | Delete a note            |

---

## 📡 WebSocket Events
| 🔄 Event        | 📦 Payload              | 📌 Description                 |
|---------------|------------------------|-------------------------------|
| `connect`    | -                        | User connects to WebSocket    |
| `disconnect` | -                        | User disconnects              |
| `join-room`  | `{ roomId, username }`  | User joins a room             |
| `leave-room` | `{ roomId }`            | User leaves a room            |
| `room-users` | `[{ username, id }]`    | List of users in the room     |
| `user-joined` | `username`             | Notification when user joins  |
| `user-left`  | `username`              | Notification when user leaves |

---

## 📁 Project Structure
```
📂 project-root
 ├── 📂 backend
 │   ├── 📂 controllers
 │   ├── 📂 models
 │   ├── 📂 routes
 │   ├── server.js
 │   ├── .env
 │   └── package.json
 │
 ├── 📂 frontend
 │   ├── 📂 src
 │   │   ├── 📂 pages
 │   │   ├── 📂 context
 │   │   ├── 📂 services
 │   │   ├── App.jsx
 │   │   ├── main.jsx
 │   │   └── index.html
 │   ├── .env
 │   ├── package.json
 │   └── vite.config.js
```

---

## 📸 Screenshots

### 🏠 Home Page
![Home Page](/frontend/src/assets/Home.png)

### 📝 Notes in a Room
![Notes in a Room](/frontend/src/assets/Room.png)

---

## 🔮 Future Implementations
🔹 **User Authentication** - Sign up and login functionality 🔑  
🔹 **Persistent Notes** - Save notes permanently with user profiles 📂  
🔹 **Dark Mode** - Theme switching for better accessibility 🌙  
🔹 **Markdown Support** - Rich text formatting for notes ✍️  
🔹 **Export Notes** - Download notes as PDF or text files 📄  
🔹 **Emoji Reactions** - React to notes with emojis 🎉  
🔹 **More Animations** - Enhance UI/UX with smooth transitions 🎭  

---

## 📜 License
📄 This project is licensed under the **MIT License**.

