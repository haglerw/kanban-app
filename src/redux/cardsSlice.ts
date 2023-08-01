import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IColumn, ITask } from '@src/types';
import { v4 as uuidv4 } from 'uuid';

interface CardsState {
  columns: IColumn[];
}

const initialState: CardsState = {
  columns: [],
};

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    addColumn(state, action: PayloadAction<string>) {
      if (state.columns.length < 5) {
        const newColumn: IColumn = {
          id: uuidv4(),
          name: action.payload,
          tasks: [],
        };
        state.columns.push(newColumn);
      }
    },
    addAllColumns(state, action: PayloadAction<IColumn[]>) {
      action?.payload?.map((column) => state.columns.push(column));
    },
    renameColumn(
      state,
      action: PayloadAction<{ columnID: string; newName: string }>
    ) {
      const { columnID, newName } = action.payload;
      const column = state.columns.find((col) => col.id === columnID);
      if (column) {
        column.name = newName;
      }
    },
    deleteColumn(state, action: PayloadAction<string>) {
      const columnID = action.payload;
      state.columns = state.columns.filter((col) => col.id !== columnID);
    },
    addTask(
      state,
      action: PayloadAction<{ columnID: string; taskName: string }>
    ) {
      const { columnID, taskName } = action.payload;
      const column = state.columns.find((col) => col.id === columnID);
      if (column) {
        const newTask: ITask = {
          id: uuidv4(),
          name: taskName,
        };
        column.tasks.push(newTask);
      }
    },
    editTask(
      state,
      action: PayloadAction<{
        columnID: string;
        taskID: string;
        updatedTask: string;
      }>
    ) {
      const { columnID, taskID, updatedTask } = action.payload;
      const column = state.columns.find((col) => col.id === columnID);
      if (column) {
        const task = column.tasks.find((foundTask) => foundTask.id === taskID);
        if (task) {
          task.name = updatedTask;
        }
      }
    },
    deleteTask(
      state,
      action: PayloadAction<{ columnID: string; taskID: string }>
    ) {
      const { columnID, taskID } = action.payload;
      const column = state.columns.find((col) => col.id === columnID);
      if (column) {
        column.tasks = column.tasks.filter((t) => t.id !== taskID);
      }
    },
    clearAllTasks(state, action: PayloadAction<{ columnID: string }>) {
      const { columnID } = action.payload;
      const column = state.columns.find((col) => col.id === columnID);
      if (column) {
        column.tasks = [];
      }
    },
    moveTask(
      state,
      action: PayloadAction<{
        taskID: string;
        fromColumnID: string;
        toColumnID: string;
      }>
    ) {
      const { taskID, fromColumnID, toColumnID } = action.payload;

      // Find the 'from' column
      const fromColumn = state.columns.find((col) => col.id === fromColumnID);

      // Find the 'to' column
      const toColumn = state.columns.find((col) => col.id === toColumnID);

      if (fromColumn && toColumn) {
        // Find the task being moved
        const taskIndex = fromColumn.tasks.findIndex(
          (task) => task.id === taskID
        );

        if (taskIndex !== -1) {
          // Remove the task from the 'from' column
          const task = fromColumn.tasks.splice(taskIndex, 1)[0];

          // Add the task to the 'to' column
          toColumn.tasks.push(task);
        }
      }
    },
  },
});

export const {
  addColumn,
  addAllColumns,
  renameColumn,
  deleteColumn,
  addTask,
  editTask,
  deleteTask,
  clearAllTasks,
  moveTask,
} = cardsSlice.actions;

export default cardsSlice.reducer;
