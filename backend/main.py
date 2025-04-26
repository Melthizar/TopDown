from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RobotState(BaseModel):
    x: int
    y: int
    facing: str
    # Add more fields as needed

class RobotAction(BaseModel):
    action: str  # e.g., 'move_up', 'move_down', 'scan', etc.

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

@app.post("/api/robot/next_action")
def next_action(state: RobotState):
    # Dummy logic: always move right
    return RobotAction(action="move_right") 