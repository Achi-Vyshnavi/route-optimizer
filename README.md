# route-optimizer
A **fleet route optimization demo** inspired by logistics startups like Fleetline. Built with **React (TypeScript)** for the frontend and **FastAPI** for the backend. The app lets you input truck and task data in JSON, then visualizes optimized routes on an interactive map.

---

## 🚀 Live Demo

- **Frontend + Map**:[http://localhost:3000](http://localhost:3000)  
- **Backend API**: [https://route-optimizer-4.onrender.com/optimize](https://route-optimizer-4.onrender.com/optimize)

---

## 📦 Features

- Interactive **Leaflet map** showing trucks and task routes.
- Round-robin route assignment for multiple trucks.
- Colored route lines for each truck.
- Popup details for each task and truck start location.
- Example JSON input included for quick testing.
- Clean, minimal, and polished “premium app” UI.

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + React-Leaflet
- **Backend:** Python + FastAPI
- **Map Tiles:** OpenStreetMap
- **Deployment:** Render (backend), any static hosting for frontend

---

## 📝 Example JSON Input

```json
{
  "trucks": [
    {"id": "Truck1", "capacity": 15, "start_location": {"lat": 37.7749, "lng": -122.4194}},
    {"id": "Truck2", "capacity": 12, "start_location": {"lat": 37.8044, "lng": -122.2711}},
    {"id": "Truck3", "capacity": 10, "start_location": {"lat": 37.6879, "lng": -122.4702}}
  ],
  "tasks": [
    {"id": "Task1", "location": {"lat": 37.7799, "lng": -122.4149}, "load": 5},
    {"id": "Task2", "location": {"lat": 37.7689, "lng": -122.4294}, "load": 3},
    {"id": "Task3", "location": {"lat": 37.7949, "lng": -122.3994}, "load": 4},
    {"id": "Task4", "location": {"lat": 37.8040, "lng": -122.2715}, "load": 6},
    {"id": "Task5", "location": {"lat": 37.8100, "lng": -122.2750}, "load": 3},
    {"id": "Task6", "location": {"lat": 37.6900, "lng": -122.4800}, "load": 4},
    {"id": "Task7", "location": {"lat": 37.6820, "lng": -122.4600}, "load": 5},
    {"id": "Task8", "location": {"lat": 37.7000, "lng": -122.4700}, "load": 3}
  ]
}
💻 Local Setup
Backend
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload

Frontend
cd frontend/route-ui
npm install
npm start


Backend runs on http://127.0.0.1:8000/

Frontend runs on http://localhost:3000/

⚡ Notes

Routes are assigned in round-robin style for simplicity.

UI is polished and responsive, with a modern, minimalistic look.

Designed to be immediately deployable and shareable.
