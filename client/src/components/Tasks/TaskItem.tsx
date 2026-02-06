import { useState } from "react";
import type { Task } from "../../types/task";
import { deleteTask, updateTask } from "../../api/task.api";

export default function TaskItem({
  task,
  onChange,
}: {
  task: Task;
  onChange: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const toggle = async () => {
    await updateTask(task.id, { completed: !task.completed });
    onChange();
  };

  const remove = async () => {
    if (confirm("Delete task?")) {
      await deleteTask(task.id);
      onChange();
    }
  };

  const saveEdit = async () => {
    if (newTitle.trim() === task.title || newTitle.trim() === "") {
      setIsEditing(false);
      setNewTitle(task.title);
      return;
    }
    await updateTask(task.id, { title: newTitle });
    setIsEditing(false);
    onChange();
  };

  return (
    // ปรับปรุง Wrapper: ใส่สีพื้นหลังตามสถานะ, ปรับ spacing
    <li
      className={`flex justify-between items-center p-4 rounded-lg border gap-4 transition-colors
      ${task.completed ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200"}`}
    >
      <div className="flex items-center gap-3 flex-1">
        {/* ปรับปรุง Checkbox ให้ดูดีขึ้น */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={toggle}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />

        {isEditing ? (
          <input
            className="border-b-2 border-blue-400 px-2 py-1 flex-1 focus:outline-none focus:border-blue-600 transition-colors"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveEdit()}
            autoFocus
          />
        ) : (
          <span
            className={`text-lg font-medium flex-1 ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}
          >
            {task.title}
          </span>
        )}
      </div>

      <div className="flex gap-2 shrink-0">
        {isEditing ? (
          <>
            {/* ปุ่ม Save */}
            <button
              onClick={saveEdit}
              className="px-3 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100 text-sm font-semibold"
            >
              Save
            </button>
            {/* ปุ่ม Cancel */}
            <button
              onClick={() => {
                setIsEditing(false);
                setNewTitle(task.title);
              }}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {/* ปุ่ม Edit */}
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium"
            >
              Edit
            </button>
            {/* ปุ่ม Delete */}
            <button
              onClick={remove}
              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}
