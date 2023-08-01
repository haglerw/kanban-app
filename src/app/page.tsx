'use client';

import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@mui/material';
import client from '@src/apolloClient';
import KanbanBoard from '@src/components/KanbanBoard';
import customTheme from '@src/customTheme';
import '@styles/globals.css';
import '@styles/styles.css';

const Home: React.FC = () => {
  return (
    <ThemeProvider theme={customTheme}>
      <ApolloProvider client={client}>
        <KanbanBoard />
      </ApolloProvider>
    </ThemeProvider>
  );
};

export default Home;
