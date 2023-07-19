'use client';

import { Breadcrumbs, Button, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useDispatch, useSelector } from 'react-redux';
import Column from './Column';
import { IColumn } from '@src/types';
import { useState } from 'react';
import { addColumn } from '@src/redux/cardsSlice';

const KanbanBoard: React.FC = () => {
  const dispatch = useDispatch();
  const columns = useSelector((state: any) => state.cards.columns);
  const canAddColumn = columns.length < 5;
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const breadcrumbs = [
    <Link underline="hover" color="inherit" href="#">
      Dashboard
    </Link>,
    <Typography key="3" color="text.primary">
      Kanban
    </Typography>,
  ];

  const handleAddColumn = () => {
    setIsAddingColumn(true);
  };

  const handleCancelAddColumn = () => {
    setIsAddingColumn(false);
    setNewColumnName('');
  };

  const handleAddColumnConfirm = () => {
    dispatch(addColumn(newColumnName));
    setIsAddingColumn(false);
    setNewColumnName('');
  };

  return (
    <div className="kanban-board">
      <h1 className="kanban-title">Kanban</h1>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        className="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
      <div className="columns-container">
        {columns.map((column: IColumn) => {
          <Column key={column.id} column={column} />;
        })}
      </div>
      {isAddingColumn ? (
        <div className="column">
          <div className="column-header">
            <input
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
            <div className="button-container">
              <button onClick={handleCancelAddColumn}>Cancel</button>
              <button onClick={handleAddColumnConfirm}>Add</button>
            </div>
          </div>
        </div>
      ) : (
        canAddColumn && (
          <div className="button" onClick={handleAddColumn}>
            Add Column
          </div>
        )
      )}
    </div>
  );
};

export default KanbanBoard;
