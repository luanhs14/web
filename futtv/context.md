# 🎯 FutTV Project Context

This document provides a summary of the FutTV project, including backend and frontend information, to facilitate understanding and future development.

## 📁 Project Structure

The project is divided into two main parts:

- `futtv-backend/`: A Node.js REST API that provides data about football matches.
- `futtv-frontend/`: A React application that consumes the backend API and displays the information to the user.

---

## 🖥️ FutTV Backend

### **Description**
A free REST API for the FutTV website, providing information on where to watch Brazilian Série A football matches.

### **Dependencies**
- Express
- dotenv
- pg (PostgreSQL)
- axios
- cors
- node-cron
- compression
- helmet

### **Scripts**
- `npm start`: Runs the server in a production environment.
- `npm run dev`: Runs the server in a development environment with hot-reload.
- `npm run migrate`: Executes database migrations and seeds.

### **Database**
- **Type:** PostgreSQL
- **Migrations and Seeds:** The `npm run migrate` command creates the necessary tables and automatically registers default broadcasters.

### **API Endpoints**
- `GET /api/health`: API status.
- `GET /api/jogos/proximos`: Matches for yesterday, today, tomorrow, and the next 2 days.
- `GET /api/jogos?data=YYYY-MM-DD`: Matches by date.
- `GET /api/jogos/rodada/:rodada`: Matches by round (1-38).
- `GET /api/times`: List of stored teams.
- `GET /api/emissoras`: List of registered broadcasters.
- `POST /api/sync`: Forces manual synchronization.

### **Cron Jobs**
- **Sync:** Every 30 minutes.
- **Backup:** Every 6 hours.
- **Auto-sync on boot:** Enabled by default.

---

##  frontend FutTV Frontend

### **Description**
A responsive web interface to follow Brazilian league matches and find out where to watch them.

### **Dependencies**
- React
- ReactDOM
- axios
- react-router-dom
- date-fns

### **Scripts**
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build.

### **API Integration**
- The frontend connects to the FutTV backend, with the default URL for development set to `http://localhost:3333/api`.
- For production, the API URL is `https://futtv.hserver.pro/api`.
