# React + PixiJS + FastAPI Tile Engine Skeleton

## Overview
This project is a code-first, editor-free 2D tile engine skeleton. It features:
- **Frontend:** React + PixiJS (TypeScript)
- **Backend:** FastAPI (Python)
- **Communication:** REST API (easy to extend to WebSocket)

You can use this as a base for AI/LLM-driven games, robot control, or any 2D tile-based simulation.

---

## Getting Started

### 1. Backend (FastAPI)

#### Setup (first time only)
```sh
python -m venv backend-venv
backend-venv\Scripts\activate  # On Windows
# or
source backend-venv/bin/activate  # On Mac/Linux
pip install -r requirements.txt
```

#### Run the backend
```sh
cd backend
uvicorn main:app --reload
```
The backend will be available at http://localhost:8000

---

### 2. Frontend (React + PixiJS)

#### Setup (first time only)
```sh
cd frontend
npm install
```

#### Run the frontend
```sh
npm run dev
```
The frontend will be available at http://localhost:5173

---

## Features
- Simple tilemap rendering (all code, no editor)
- Robot sprite with keyboard controls
- REST API call to backend for robot action (demo)
- Easy to extend with AI/LLM logic in Python backend

## Next Steps
- Add your own tiles, sprites, and logic
- Extend backend for AI/LLM control
- Upgrade to WebSocket for real-time features

---

## License
MIT (or your choice)
