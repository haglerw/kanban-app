'use client';

import { Card, CardContent } from '@mui/material';
import { deleteTask, editTask } from '@src/redux/cardsSlice';
import { ITask } from '@src/types';
import React from 'react';
import { useDispatch } from 'react-redux';

interface TaskProps {
  task: ITask;
  columnID: string;
}

const Task: React.FC<TaskProps> = ({ task, columnID }) => {
  const dispatch = useDispatch();

  const handleEditTask = (updatedTask: string) => {
    dispatch(editTask({ columnID, taskID: task.id, updatedTask }));
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask({ columnID, taskID: task.id }));
  };

  return (
    <div>
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <p>{task.name}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Task;
