'use client';

import { Card, CardContent } from '@mui/material';
import { deleteTask, editTask } from '@src/redux/cardsSlice';
import { ITask } from '@src/types';
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { ItemTypes } from './ItemTypes';

interface TaskProps {
  task: ITask;
  columnID: string;
}

const Task: React.FC<TaskProps> = ({ task, columnID }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);

  const handleEditTask = (updatedTask: string) => {
    dispatch(editTask({ columnID, taskID: task.id, updatedTask }));
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask({ columnID, taskID: task.id }));
  };

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, columnID, type: ItemTypes.TASK },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0 : 1 }}>
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <p>{task.name}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Task;
