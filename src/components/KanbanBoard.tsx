'use client';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { addAllColumns, addColumn } from '@src/redux/cardsSlice';
import { IColumn } from '@src/types';
import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import Column from './Column';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_COLUMNS = gql`
  query {
    columns {
      id
      name
      tasks {
        id
        name
      }
    }
  }
`;

const ADD_COLUMN = gql`
  mutation AddColumn($name: String!) {
    addColumn(name: $name) {
      id
      name
      tasks {
        id
        name
      }
    }
  }
`;

const RENAME_COLUMN = gql`
  mutation EditColumnName($id: ID!, $name: String!) {
    editColumnName(id: $id, name: $name) {
      id
      name
    }
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
  mutation AddTask($task: TaskInput!) {
    addTask(task: $task) {
      id
      name
    }
  }
`;

const KanbanBoard: React.FC = () => {
  const dispatch = useDispatch();
  const { error, data } = useQuery(GET_COLUMNS);
  const [addColumn] = useMutation(ADD_COLUMN);
  const [renameColumn] = useMutation(RENAME_COLUMN);
  const [deleteColumn] = useMutation(DELETE_COLUMN);
  const [addTask] = useMutation(ADD_TASK);

  const columnsData = data?.columns;

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [error2, setError] = useState('');

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

    // dispatch(addColumn(newColumnName));
    setIsAddingColumn(false);
    setNewColumnName('');
    setError('');
  };

  const submit = () => {
    if (!newColumnName.trim()) {
      setError('Column name is required');
      return;
    }

    addColumn({ variables: { name: newColumnName } }).then((res) => {
      console.log(res);
      // dispatch(addColumn(newColumnName));
      setIsAddingColumn(false);
      setNewColumnName('');
      setError('');
    });
  };

  useEffect(() => {
    dispatch(addAllColumns(columnsData));
  }, [columnsData, dispatch]);

  const columns = useSelector((state: any) => state.cards.columns);
  const canAddColumn = columns?.length < 5;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-board">
        <h1 className="kanban-title">Kanban</h1>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          className="breadcrumb"
        >
          <Link underline="hover" color="text.primary" href="#">
            Dashboard
          </Link>
          ,<Typography key="3">Kanban</Typography>
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
                        error={!!error2}
                        helperText={error2}
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
