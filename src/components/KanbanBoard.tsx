'use client';

import {
  Breadcrumbs,
  Box,
  Link,
  Typography,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useDispatch, useSelector } from 'react-redux';
import Column from './Column';
import { IColumn } from '@src/types';
import { useState } from 'react';
import { addColumn } from '@src/redux/cardsSlice';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const KanbanBoard: React.FC = () => {
  const dispatch = useDispatch();
  const columns = useSelector((state: any) => state.cards.columns);
  const canAddColumn = columns.length < 5;
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [error, setError] = useState('');

  const breadcrumbs = [
    <Link underline="hover" color="text.primary" href="#">
      Dashboard
    </Link>,
    <Typography key="3">Kanban</Typography>,
  ];

  const handleAddColumn = () => {
    setIsAddingColumn(true);
  };

  const handleCancelAddColumn = () => {
    setIsAddingColumn(false);
    setNewColumnName('');
    setError('');
  };

  const handleAddColumnConfirm = () => {
    // check if the new task name is empty
    if (!newColumnName.trim()) {
      setError('Column name is required');
      return;
    }

    dispatch(addColumn(newColumnName));
    setIsAddingColumn(false);
    setNewColumnName('');
    setError('');
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
          {columns?.map((column: IColumn) => (
            <Column key={column.id} column={column} />
          ))}

          {isAddingColumn ? (
            <div className="column">
              <div className="column-header">
                <Card>
                  <CardContent>
                    <Box component="form" autoComplete="off">
                      <TextField
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                        error={!!error}
                        helperText={error}
                      />
                    </Box>
                  </CardContent>
                  <CardActions className="cardActions">
                    <Button
                      size="small"
                      color="secondary"
                      onClick={handleCancelAddColumn}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={handleAddColumnConfirm}
                    >
                      Add
                    </Button>
                  </CardActions>
                </Card>
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
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;
