# Stardew Valley Style Game – Phaser.js + FastAPI

## Overview
This project is a modern, code-driven 2D tile-based game inspired by Stardew Valley and classic RPGs.

- **Frontend:** Phaser.js (TypeScript, Vite)
- **Backend:** FastAPI (Python, for AI/LLM, world logic, and persistence)
- **Assets:** All original images and tiles are preserved in the assets/public folders.

No visual editors are required for the frontend. All logic, rendering, and AI integration is done in code.

---

## Packaging for End Users

**When you are ready to distribute the game as a single executable (.exe) for end users:**
- You can use [Tauri](https://tauri.app/) to bundle the frontend (React + PixiJS) and the backend (FastAPI) into one .exe file.
- This allows users with no computer skills to simply double-click and run the game, with no setup required.
- Ask the assistant for a step-by-step guide when you reach this stage!

---

## Project Structure

```
TopDown/
├── frontend/         # Phaser.js + TypeScript game (Vite)
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

### 2. Frontend (Phaser.js + Vite)

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
- Tile-based world rendering (Phaser.js)
- Player movement and camera following
- Easy to extend with AI/LLM logic in Python backend
- Ready for asset integration and procedural world logic

## How to Log Changes
- Any time you want to log a change or note a problem, type `update` as your message. The assistant will append the change/problem to `updates.md`.

## License
MIT (or your choice)

## 📝 How to Restore Your Workflow in a New Conversation

If you start a new chat and want the assistant to remember your push workflow and project rules, copy and paste the following as your first message:

```
Rule for Assistant:
Whenever I type `push` (and nothing else), you must:
1. Update `README.md` and `updates.md` with all new features, changes, and known issues since the last push.
2. Update `CHANGELOG.md` with a summary of all changes since the last version/tag, following standard changelog format.
3. Run pre-push checks: lint and test both frontend and backend (if present). If any check fails, report the error and stop the push.
4. Stage all new/changed files (`git add .`).
5. Show me the `git status` and summarize what will be committed.
6. Generate a descriptive commit message based on the changes.
7. Commit the changes.
8. Automatically update the version tag (major, minor, or patch) based on the scale of changes, and push the tag to GitHub.
9. Push all changes to GitHub.
10. If this is a major or minor version, remind me to draft a GitHub Release.

Always follow this workflow exactly when I type `push`.
If I type `update`, append the latest change/problem to `updates.md` and `CHANGELOG.md`.
```

--- 