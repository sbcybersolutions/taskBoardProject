import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { useState } from "react";

const columnStyles = {
  todo: {
    bg: "bg-gradient-to-br from-slate-50 to-gray-50",
    badge: "bg-slate-100 text-slate-700",
    accent: "border-slate-200",
  },
  "in-progress": {
    bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
    badge: "bg-blue-100 text-blue-700",
    accent: "border-blue-200",
  },
  done: {
    bg: "bg-gradient-to-br from-emerald-50 to-green-50",
    badge: "bg-emerald-100 text-emerald-700",
    accent: "border-emerald-200",
  },
};

export default function Column({ column, tasks, onAddTask, onDeleteTask }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask(column.id, title, description);
    setTitle("");
    setDescription("");
    setShowForm(false);
  };

  const styles = columnStyles[column.id] || columnStyles["todo"];

  return (
    <div
      className={`${
        styles.bg
      } rounded-2xl p-4 min-w-[320px] flex flex-col max-h-[calc(100vh-180px)] border-2 ${
        styles.accent
      } shadow-sm transition-all ${
        isOver ? "ring-2 ring-blue-400 ring-offset-2" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
        <h2 className="font-bold text-lg text-gray-700 flex items-center gap-2">
          {column.title}
        </h2>
        <span
          className={`${styles.badge} px-2.5 py-1 rounded-full text-xs font-semibold`}
        >
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto space-y-3 mb-3 px-1"
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={() => onDeleteTask(task.id, column.id)}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && !showForm && (
          <div className="text-center py-12 text-gray-400">
            <svg
              className="w-16 h-16 mx-auto mb-3 opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-sm font-medium">No tasks yet</p>
          </div>
        )}
      </div>

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-xl shadow-md border border-gray-200 space-y-3"
        >
          <input
            type="text"
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setTitle("");
                setDescription("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-300 text-gray-600 py-3 rounded-xl hover:border-blue-400 hover:bg-white hover:text-blue-600 transition-all font-medium text-sm flex items-center justify-center gap-2 group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">
            +
          </span>
          Add Task
        </button>
      )}
    </div>
  );
}
