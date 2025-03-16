import React, { useState } from "react";

const TaskItem = ({ task, index, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleStatusChange = () => {
    const updatedTask = { ...editedTask, status: !editedTask.status };
    onUpdate(task.id, updatedTask);
    setEditedTask(updatedTask);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(task.id, editedTask);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditedTask({ ...editedTask, task: e.target.value });
  };

  return (
    <tr className={isEditing ? "editing" : ""}>
      <td data-label="No">{index}</td>
      <td data-label="Task">
        {isEditing ? (
          <input
            value={editedTask.task}
            onChange={handleChange}
            className="border p-2"
            autoFocus
          />
        ) : (
          editedTask.task
        )}
      </td>
      <td data-label="Date">{editedTask.date}</td>
      <td data-label="Status">
        <input
          type="checkbox"
          checked={editedTask.status}
          onChange={handleStatusChange}
        />
      </td>
      <td data-label="Edit">
        {isEditing ? (
          <button onClick={handleSave}>💾</button>
        ) : (
          <button onClick={handleEdit}>✏️</button>
        )}
      </td>
      <td data-label="Delete">
        <button onClick={() => onDelete(task.id)}>🗑️</button>
      </td>
    </tr>
  );
};

export default TaskItem;