import type { GoogleTask } from "../types";

interface TasksListProps {
  tasks: GoogleTask[];
}

export function TasksList({ tasks }: TasksListProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-1/2">
        <p className="text-xl text-gray-400 font-inter">Нет задач</p>
      </div>
    );
  }

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="flex flex-col h-full w-1/2 px-4 py-2 overflow-y-auto border-l border-gray-300">
      <h2 className="text-2xl font-bold text-black mb-3 font-inter">Задачи</h2>

      {/* Active tasks */}
      {activeTasks.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2 font-inter">
            Активные ({activeTasks.length})
          </div>
          <div className="flex flex-col gap-2">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-2 p-2 rounded bg-white border border-gray-200"
              >
                <div className="w-5 h-5 mt-1 shrink-0 rounded border-2 border-gray-400 bg-white" />
                <div className="flex-1 min-w-0">
                  <p className="text-base text-black font-inter wrap-break-word">
                    {task.title}
                  </p>
                  {task.dueDate && (
                    <p className="text-xs text-gray-500 mt-1 font-geneva9">
                      {new Date(task.dueDate).toLocaleDateString("ru-RU")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <div>
          <div className="text-sm text-gray-500 mb-2 font-inter">
            Завершённые ({completedTasks.length})
          </div>
          <div className="flex flex-col gap-2">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-2 p-2 rounded bg-gray-100 border border-gray-200"
              >
                <div className="w-5 h-5 mt-1 shrink-0 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base text-gray-600 font-inter wrap-break-word line-through">
                    {task.title}
                  </p>
                  {task.dueDate && (
                    <p className="text-xs text-gray-400 mt-1 font-geneva9">
                      {new Date(task.dueDate).toLocaleDateString("ru-RU")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
