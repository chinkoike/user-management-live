import { useState } from "react";
import { createTask } from "../../api/task.api";

export default function TaskForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createTask(title);
    setTitle("");
    onSuccess();
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        className="border p-2 flex-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task..."
      />
      <button className="bg-blue-500 text-white px-4">Add</button>
    </form>
  );
}
