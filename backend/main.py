from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

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

class OptimizeRequest(BaseModel):
    trucks: List[Truck]
    tasks: List[Task]

@app.post("/optimize")
def optimize_routes(data: OptimizeRequest):
    # naive assignment: assign tasks sequentially until truck capacity runs out
    assignments: Dict[str, List[Task]] = {}
    routes: Dict[str, List[Task]] = {}

    for truck in data.trucks:
        assignments[truck.id] = []
        routes[truck.id] = []
        remaining_capacity = truck.capacity
        for task in data.tasks:
            if task.load <= remaining_capacity and task.id not in [t.id for t in assignments[truck.id]]:
                assignments[truck.id].append(task)
                routes[truck.id].append(task)
                remaining_capacity -= task.load

    return {"assignments": {k:[t.dict() for t in v] for k,v in assignments.items()},
            "routes": {k:[t.dict() for t in v] for k,v in routes.items()}}
