from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

# Models
class Location(BaseModel):
    lat: float
    lng: float

class Truck(BaseModel):
    id: str
    capacity: int
    start_location: Location

class Task(BaseModel):
    id: str
    location: Location
    load: int

class FleetInput(BaseModel):
    trucks: List[Truck]
    tasks: List[Task]

# Create FastAPI app
app = FastAPI(title="Fleet Optimizer API")

# Allow frontend access (both local dev and deployed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local frontend
        "https://route-optimizer-3.onrender.com",  # Your deployed frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy route optimizer (round-robin assignment)
@app.post("/optimize")
def optimize(fleet: FleetInput):
    assignments: Dict[str, List[Task]] = {}
    routes: Dict[str, List[Task]] = {}

    num_trucks = len(fleet.trucks)
    if num_trucks == 0:
        return {"assignments": {}, "routes": {}}

    # Assign tasks to trucks round-robin
    for i, truck in enumerate(fleet.trucks):
        truck_tasks = fleet.tasks[i::num_trucks]
        assignments[truck.id] = truck_tasks
        routes[truck.id] = truck_tasks

    return {"assignments": assignments, "routes": routes}

# Root health check
@app.get("/")
def root():
    return {"message": "Fleet Optimizer API is running."}
