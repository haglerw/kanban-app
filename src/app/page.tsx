'use client';

import { ThemeProvider } from '@mui/material';
import KanbanBoard from '@src/components/KanbanBoard';
import customTheme from '@src/customTheme';
import '@styles/globals.css';
import '@styles/styles.css';

const Home: React.FC = () => {
  return (
    <ThemeProvider theme={customTheme}>
      <KanbanBoard />
    </ThemeProvider>
  );
};

export default Home;
