# TopDown: React + PixiJS + FastAPI Game Skeleton

## Overview
This project is a modern, code-only 2D tile engine and game skeleton. It uses:
- **Frontend:** React + PixiJS (TypeScript)
- **Backend:** FastAPI (Python)
- **Assets:** All your original images and tiles are preserved in asset folders.

No visual editors are required. All logic, rendering, and AI integration is done in code.

---

## Project Structure

```
TopDown/
├── frontend/         # React + PixiJS app (TypeScript)
├── backend/          # FastAPI backend (Python)
├── backend-venv/     # Python virtual environment for backend
├── game_assets/      # Game image/sprite assets
├── ground_tiles/     # Ground tile images
├── static_assets/    # Additional static assets
├── crafting_materials/  # (If used in your new game)
├── temp_assets/         # (If used in your new game)
├── reference_images/    # (If used in your new game)
├── backup/           # All old/editor-based files and folders
├── .gitignore
├── README.md         # This file
├── updates.md        # Log of all project changes and known issues
├── LICENSE           # Project license
├── .editorconfig     # EditorConfig for consistent code style
```

---

## Getting Started

### 1. Backend (FastAPI)

#### Setup (first time only)
```sh
python -m venv backend-venv
backend-venv\Scripts\activate  # On Windows
# or
source backend-venv/bin/activate  # On Mac/Linux
pip install -r backend/requirements.txt
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

## How to Log Changes
- Any time you want to log a change or note a problem, type `update` as your message. The assistant will append the change/problem to `updates.md`.

## License
MIT (or your choice) 