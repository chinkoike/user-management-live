import type { Task } from "../../types/task";
import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  onChange,
}: {
  tasks: Task[];
  onChange: () => void;
}) {
  if (!tasks || tasks.length === 0) {
    return <p className="text-center text-gray-500">ไม่พบรายการงาน</p>;
  }
  return (
    <div>
      <ul className="space-y-2 mt-4">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onChange={onChange} />
        ))}
      </ul>
    </div>
  );
}
