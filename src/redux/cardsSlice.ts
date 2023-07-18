import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Task {
  id: string;
  name: string;
}

interface Column {
  id: string;
  name: string;
  tasks: Task[];
}

interface CardsState {
  columns: Column[];
}

const initialState: CardsState = {
  columns: [],
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addColumn(state, action: PayloadAction<string>) {
      if (state.columns.length < 5) {
        const newColumn: Column = {
          id: `column${state.columns.length + 1}`,
          name: action.payload,
          tasks: [],
        };
        state.columns.push(newColumn);
      }
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
        const newTask: Task = {
          id: `task${column.tasks.length + 1}`,
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
  },
});

export const {
  addColumn,
  renameColumn,
  deleteColumn,
  addTask,
  editTask,
  deleteTask,
} = cardsSlice.actions;

export default cardsSlice.reducer;
