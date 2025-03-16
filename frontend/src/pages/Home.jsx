import React, { useState, useEffect } from "react";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8000/tasks");
      const data = await response.json();
      setTasks(data);
      updateCounts(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const updateCounts = (tasks) => {
    setTotal(tasks.length);
    setCompleted(tasks.filter((t) => t.status).length);
    setPending(tasks.length - completed);
  };

  const addTask = async (task) => {
    try {
      await fetch("http://localhost:8000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (taskId, task) => {
    try {
      await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: "DELETE",
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container">
      <h1>To-do list</h1>
      <div className="counts">
        {total} Total, {completed} Completed, {pending} Pending
      </div>
      <TaskForm onAdd={addTask} />
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Task</th>
            <th>Date</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              index={index + 1}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;