import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import useTaskStore from "../store/taskStore";
import Column from "./Column";
import TaskCard from "./TaskCard";

export default function Board() {
  const { columns, tasks, columnOrder, addTask, moveTask, deleteTask } =
    useTaskStore();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    let sourceColumnId = null;
    let sourceIndex = -1;

    for (const [colId, column] of Object.entries(columns)) {
      const index = column.taskIds.indexOf(activeId);
      if (index !== -1) {
        sourceColumnId = colId;
        sourceIndex = index;
        break;
      }
    }

    if (!sourceColumnId) return;

    let destColumnId = null;
    let destIndex = -1;

    if (columns[overId]) {
      destColumnId = overId;
      destIndex = columns[overId].taskIds.length;
    } else {
      for (const [colId, column] of Object.entries(columns)) {
        const index = column.taskIds.indexOf(overId);
        if (index !== -1) {
          destColumnId = colId;
          destIndex = index;
          break;
        }
      }
    }

    if (destColumnId) {
      moveTask(activeId, sourceColumnId, destColumnId, sourceIndex, destIndex);
    }
  };

  const activeTask = activeId ? tasks[activeId] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 p-6 overflow-x-auto">
        {columnOrder.map((columnId) => {
          const column = columns[columnId];
          const columnTasks = column.taskIds
            .map((taskId) => tasks[taskId])
            .filter(Boolean);

          return (
            <Column
              key={column.id}
              column={column}
              tasks={columnTasks}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-2 scale-105">
            <TaskCard task={activeTask} onDelete={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
