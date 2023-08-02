'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
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
import { IColumn } from '@src/types';
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './Column';

export const GET_COLUMNS = gql`
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

const KanbanBoard: React.FC = () => {
  const { error, data } = useQuery(GET_COLUMNS);
  const [addColumn] = useMutation(ADD_COLUMN);

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [error2, setError] = useState('');

  const canAddColumn = data?.columns?.length < 5;

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

    addColumn({
      variables: { name: newColumnName },
      refetchQueries: [{ query: GET_COLUMNS }],
    })
      .then((res) => {
        setIsAddingColumn(false);
        setNewColumnName('');
        setError('');
      })
      .catch((error) => console.log(`Error adding column: ${error}`));
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
          <Link underline="hover" color="text.primary" href="#">
            Dashboard
          </Link>
          ,<Typography key="3">Kanban</Typography>
        </Breadcrumbs>
        <div className="columns-container">
          {data?.columns?.map((column: IColumn) => (
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
