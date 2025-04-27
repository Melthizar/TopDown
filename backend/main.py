from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import noise # For procedural generation
import random # Can add randomness
from typing import List

app = FastAPI()

# --- Constants ---
CHUNK_SIZE = 16 # Tiles per chunk (square)
TILE_TYPE_GRASS = 0
TILE_TYPE_DIRT = 1

# Noise parameters (adjust for different world styles)
NOISE_SCALE = 0.1 # How zoomed in/out the noise pattern is
NOISE_OCTAVES = 4 # Number of noise layers combined
NOISE_PERSISTENCE = 0.5 # Amplitude decrease per octave
NOISE_LACUNARITY = 2.0 # Frequency increase per octave
DIRT_THRESHOLD = 0.1 # Noise values above this become dirt

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class RobotState(BaseModel):
    x: float # Use float for potentially smoother movement later
    y: float
    facing: str

class RobotAction(BaseModel):
    action: str

class ChunkData(BaseModel):
    cx: int
    cy: int
    tiles: List[List[int]] # 2D array of tile IDs

# --- Helper Functions ---
def generate_chunk_data(cx: int, cy: int) -> List[List[int]]:
    """Generates tile data for a single chunk using Perlin noise."""
    tiles = [[TILE_TYPE_GRASS for _ in range(CHUNK_SIZE)] for _ in range(CHUNK_SIZE)]
    seed = 12345 # Use a fixed seed for now for predictability, change later for randomness

    for y in range(CHUNK_SIZE):
        for x in range(CHUNK_SIZE):
            # Calculate world coordinates for noise sampling
            nx = (cx * CHUNK_SIZE + x) * NOISE_SCALE
            ny = (cy * CHUNK_SIZE + y) * NOISE_SCALE

            # Generate noise value
            noise_val = noise.pnoise2(
                nx,
                ny,
                octaves=NOISE_OCTAVES,
                persistence=NOISE_PERSISTENCE,
                lacunarity=NOISE_LACUNARITY,
                base=seed # Use seed here
            )

            # Determine tile type based on noise
            if noise_val > DIRT_THRESHOLD:
                tiles[y][x] = TILE_TYPE_DIRT
            else:
                tiles[y][x] = TILE_TYPE_GRASS
    return tiles

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

@app.post("/api/robot/next_action")
def get_next_robot_action(state: RobotState):
    # Dummy logic: always move right (to be replaced with AI/LLM)
    # TODO: Implement AI/LLM logic here
    print(f"Received robot state: {state}")
    return RobotAction(action="move_right")

@app.get("/api/world/chunk", response_model=ChunkData)
def get_world_chunk(
    cx: int = Query(..., description="Chunk X coordinate"),
    cy: int = Query(..., description="Chunk Y coordinate")
):
    """Generates or retrieves data for a specific world chunk."""
    # TODO: Implement persistence (loading/saving chunks)
    print(f"Generating chunk: ({cx}, {cy})")
    tile_data = generate_chunk_data(cx, cy)
    return ChunkData(cx=cx, cy=cy, tiles=tile_data) 