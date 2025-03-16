from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import json
import os

app = FastAPI()

TASKS_FILE = "tasks.json"

if os.path.exists(TASKS_FILE):
    with open(TASKS_FILE, "r") as f:
        tasks = json.load(f)
else:
    tasks = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    task: str
    date: str
    status: bool = False
    
def save_tasks():
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, indent=4)

@app.get("/tasks")
async def get_tasks():
    return tasks

@app.post("/tasks")
async def add_task(task: Task):
    task_dict = task.dict()
    task_dict["id"] = len(tasks) + 1
    task_dict["date"] = task_dict.get("date", "") or datetime.now().strftime("%Y-%m-%d")
    tasks.append(task_dict)
    save_tasks() 
    return {"message": "Task added", "task": task_dict}

@app.put("/tasks/{task_id}")
async def update_task(task_id: int, task: Task):
    for i, t in enumerate(tasks):
        if t["id"] == task_id:
            tasks[i] = task.dict()
            tasks[i]["id"] = task_id
            save_tasks() 
            return {"message": "Task updated"}
    return {"message": "Task not found"}

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    for i, t in enumerate(tasks):
        if t["id"] == task_id:
            tasks.pop(i)
            save_tasks()  
            return {"message": "Task deleted"}
    return {"message": "Task not found"}