'use client';

import { gql, useMutation } from '@apollo/client';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material';
import { IColumn, ITask } from '@src/types';
import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { GET_COLUMNS } from './KanbanBoard';
import Task from './Task';

interface ColumnProps {
  column: IColumn;
}

const RENAME_COLUMN = gql`
  mutation EditColumn($id: ID!, $name: String!) {
    editColumn(id: $id, name: $name) {
      id
      name
    }
  }
`;

const CLEAR_TASKS = gql`
  mutation ClearTasks($columnID: ID!) {
    clearTasks(columnID: $columnID)
  }
`;

const DELETE_COLUMN = gql`
  mutation DeleteColumn($id: ID!) {
    deleteColumn(id: $id) {
      id
      name
    }
  }
`;

const ADD_TASK = gql`
  mutation AddTask($taskInput: TaskInput!) {
    addTask(taskInput: $taskInput) {
      id
      name
      columnID
    }
  }
`;

const MOVE_TASK = gql`
  mutation MoveTask($taskID: ID!, $fromColumnID: ID!, $toColumnID: ID!) {
    moveTask(
      taskID: $taskID
      fromColumnID: $fromColumnID
      toColumnID: $toColumnID
    )
  }
`;

const Column: React.FC<ColumnProps> = ({ column }) => {
  const [newTaskName, setNewTaskName] = useState('');
  const [newColumnName, setNewColumnName] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingColumn, setIsEditingColumn] = useState(false);
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState('');
  const [colError, setColError] = useState('');

  const [renameColumn] = useMutation(RENAME_COLUMN);
  const [deleteColumn] = useMutation(DELETE_COLUMN);
  const [addTask] = useMutation(ADD_TASK);
  const [clearTasks] = useMutation(CLEAR_TASKS);
  const [moveTask] = useMutation(MOVE_TASK);

  const handleAddTask = () => {
    setIsAddingTask(true);
  };

  const handleCancelAddTask = () => {
    setIsAddingTask(false);
    setNewTaskName('');
    setError('');
  };

  const handleCancelEditColumn = () => {
    setIsEditingColumn(false);
    setNewColumnName('');
    setColError('');
  };

  const handleMenuOpen = (event: any) => {
    setMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenu(null);
  };

  const handleRename = () => {
    setIsEditingColumn(true);
    handleMenuClose();
  };

  const handleClearTasks = () => {
    clearTasks({
      variables: { columnID: column.id },
      refetchQueries: [{ query: GET_COLUMNS }],
    })
      .then(() => handleMenuClose())
      .catch((error) => console.log(`Error clearing tasks: ${error}`));
  };

  const handleDeleteColumn = () => {
    deleteColumn({
      variables: { id: column.id },
      refetchQueries: [{ query: GET_COLUMNS }],
    })
      .then(() => handleMenuClose())
      .catch((error) => console.log(`Error deleting column: ${error}`));
  };

  const handleAddTaskConfirm = () => {
    // check if the new task name is empty
    if (!newTaskName.trim()) {
      setError('Task name is required');
      return;
    }

    addTask({
      variables: { taskInput: { columnID: column.id, name: newTaskName } },
      refetchQueries: [{ query: GET_COLUMNS }],
    })
      .then(() => {
        setIsAddingTask(false);
        setNewTaskName('');
        setError('');
      })
      .catch((error) => console.log(`Error adding new task: ${error}`));
  };

  const handleEditColumnConfirm = () => {
    // check if the new task name is empty
    if (!newColumnName.trim()) {
      setColError('Column name is required');
      return;
    }

    renameColumn({
      variables: { id: column.id, name: newColumnName },
    })
      .then(() => {
        setIsEditingColumn(false);
        setNewColumnName('');
        setColError('');
      })
      .catch((error) => {
        console.log(`Error renaming column: ${error}`);
      });
  };

  // Hook to handle drag and drop of tasks within this column
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item: any) => {
      if (item.columnID !== column.id) {
        moveTask({
          variables: {
            taskID: item.id,
            fromColumnID: item.columnID,
            toColumnID: column.id,
          },
          refetchQueries: [{ query: GET_COLUMNS }],
        }).catch((error) => console.log(`Error moving task: ${error}`));
      }
    },
  });

  return (
    <div className="column" ref={drop}>
      <div className="column-header">
        <Card sx={{ width: 200 }}>
          {isEditingColumn ? (
            <Card sx={{ boxShadow: 0 }}>
              <CardContent>
                <Box component="form" autoComplete="off">
                  <TextField
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    defaultValue={column.name}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    autoFocus
                  />
                </Box>
              </CardContent>
              <CardActions className="cardActions">
                <Button
                  size="small"
                  color="secondary"
                  onClick={handleCancelEditColumn}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={handleEditColumnConfirm}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          ) : (
            <CardHeader
              title={column.name}
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <>
                  <IconButton aria-label="settings" onClick={handleMenuOpen}>
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menu}
                    open={Boolean(menu)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleRename}>Rename</MenuItem>
                    <MenuItem onClick={handleClearTasks}>Clear</MenuItem>
                    <MenuItem onClick={handleDeleteColumn}>Delete</MenuItem>
                  </Menu>
                </>
              }
            />
          )}
          <Divider />
          <CardContent>
            <div className="task-list">
              {column.tasks.map((task: ITask) => (
                <Task key={task.id} columnID={column.id} task={task} />
              ))}
            </div>
          </CardContent>
          <Divider />
          <CardActions>
            {!isAddingTask ? (
              <Box display="flex" justifyContent="center" width="100%">
                <Button size="small" color="secondary" onClick={handleAddTask}>
                  Add Card
                </Button>
              </Box>
            ) : (
              <Card sx={{ boxShadow: 0 }}>
                <CardContent>
                  <Box component="form" autoComplete="off">
                    <TextField
                      id="outlined-basic"
                      label="Name"
                      variant="outlined"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      error={!!error}
                      helperText={error}
                    />
                  </Box>
                </CardContent>
                <CardActions className="cardActions">
                  <Button
                    size="small"
                    color="secondary"
                    onClick={handleCancelAddTask}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={handleAddTaskConfirm}
                  >
                    Add
                  </Button>
                </CardActions>
              </Card>
            )}
          </CardActions>
        </Card>
      </div>
    </div>
  );
};

export default Column;
