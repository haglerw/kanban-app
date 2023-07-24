'use client';

import {
  addTask,
  clearAllTasks,
  deleteColumn,
  moveTask,
  renameColumn,
} from '@src/redux/cardsSlice';
import { IColumn, ITask } from '@src/types';
import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { ItemTypes } from './ItemTypes';
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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Task from './Task';

interface ColumnProps {
  column: IColumn;
}

const Column: React.FC<ColumnProps> = ({ column }) => {
  const dispatch = useDispatch();
  const [newTaskName, setNewTaskName] = useState('');
  const [newColumnName, setNewColumnName] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingColumn, setIsEditingColumn] = useState(false);
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState('');
  const [colError, setColError] = useState('');

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
    dispatch(clearAllTasks({ columnID: column.id }));
    handleMenuClose();
  };

  const handleDeleteColumn = () => {
    dispatch(deleteColumn(column.id));
    handleMenuClose();
  };

  const handleAddTaskConfirm = () => {
    // check if the new task name is empty
    if (!newTaskName.trim()) {
      setError('Task name is required');
      return;
    }

    dispatch(addTask({ columnID: column.id, taskName: newTaskName }));
    setIsAddingTask(false);
    setNewTaskName('');
    setError('');
  };

  const handleEditColumnConfirm = () => {
    // check if the new task name is empty
    if (!newColumnName.trim()) {
      setColError('Column name is required');
      return;
    }

    dispatch(renameColumn({ columnID: column.id, newName: newColumnName }));
    setIsEditingColumn(false);
    setNewColumnName('');
    setColError('');
  };

  // Hook to handle drag and drop of tasks within this column
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item: any) => {
      if (item.columnID !== column.id) {
        dispatch(
          moveTask({
            taskID: item.id,
            fromColumnID: item.columnID,
            toColumnID: column.id,
          })
        );
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
