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
app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy route optimizer
@app.post("/optimize")
def optimize(fleet: FleetInput):
    assignments: Dict[str, List[Task]] = {}
    routes: Dict[str, List[Task]] = {}

    for i, truck in enumerate(fleet.trucks):
        # Assign tasks in round-robin style
        truck_tasks = fleet.tasks[i::len(fleet.trucks)]
        assignments[truck.id] = truck_tasks
        routes[truck.id] = truck_tasks

    return {"assignments": assignments, "routes": routes}
