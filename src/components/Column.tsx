'use client';

import {
  addTask,
  deleteColumn,
  moveTask,
  renameColumn,
} from '@src/redux/cardsSlice';
import { IColumn } from '@src/types';
import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { ItemTypes } from './ItemTypes';

interface ColumnProps {
  column: IColumn;
}

const Column: React.FC<ColumnProps> = ({ column }) => {
  const dispatch = useDispatch();
  const [newTaskName, setNewTaskName] = useState('');

  const handleRenameColumn = (newName: string) => {
    dispatch(renameColumn({ columnID: column.id, newName }));
  };

  const handleDeleteColumn = () => {
    dispatch(deleteColumn(column.id));
  };

  const handleAddTask = (taskName: string) => {
    dispatch(addTask({ columnID: column.id, taskName }));
    setNewTaskName('');
  };

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
        <input
          value={column.name}
          onChange={(e) => handleRenameColumn(e.target.value)}
          className="column-title"
        />
      </div>
    </div>
  );
};

export default Column;
