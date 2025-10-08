import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

const useTaskStore = create(
  persist(
    (set) => ({
      columns: {
        todo: {
          id: "todo",
          title: "To Do",
          taskIds: [],
        },
        "in-progress": {
          id: "in-progress",
          title: "In Progress",
          taskIds: [],
        },
        done: {
          id: "done",
          title: "Done",
          taskIds: [],
        },
      },
      tasks: {},
      columnOrder: ["todo", "in-progress", "done"],

      addTask: (columnId, title, description) =>
        set((state) => {
          const taskId = uuidv4();
          const newTask = {
            id: taskId,
            title,
            description,
            createdAt: new Date().toISOString(),
          };

          return {
            tasks: { ...state.tasks, [taskId]: newTask },
            columns: {
              ...state.columns,
              [columnId]: {
                ...state.columns[columnId],
                taskIds: [...state.columns[columnId].taskIds, taskId],
              },
            },
          };
        }),

      moveTask: (
        taskId,
        sourceColumnId,
        destColumnId,
        sourceIndex,
        destIndex
      ) =>
        set((state) => {
          const sourceColumn = state.columns[sourceColumnId];
          const destColumn = state.columns[destColumnId];

          const newSourceTaskIds = Array.from(sourceColumn.taskIds);
          newSourceTaskIds.splice(sourceIndex, 1);

          if (sourceColumnId === destColumnId) {
            newSourceTaskIds.splice(destIndex, 0, taskId);
            return {
              columns: {
                ...state.columns,
                [sourceColumnId]: {
                  ...sourceColumn,
                  taskIds: newSourceTaskIds,
                },
              },
            };
          }

          const newDestTaskIds = Array.from(destColumn.taskIds);
          newDestTaskIds.splice(destIndex, 0, taskId);

          return {
            columns: {
              ...state.columns,
              [sourceColumnId]: {
                ...sourceColumn,
                taskIds: newSourceTaskIds,
              },
              [destColumnId]: {
                ...destColumn,
                taskIds: newDestTaskIds,
              },
            },
          };
        }),

      deleteTask: (taskId, columnId) =>
        set((state) => {
          const { [taskId]: _deleted, ...remainingTasks } = state.tasks;
          const column = state.columns[columnId];

          return {
            tasks: remainingTasks,
            columns: {
              ...state.columns,
              [columnId]: {
                ...column,
                taskIds: column.taskIds.filter((id) => id !== taskId),
              },
            },
          };
        }),
    }),
    {
      name: "task-board-storage",
    }
  )
);

export default useTaskStore;
