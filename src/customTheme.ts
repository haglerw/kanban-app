import { createTheme } from '@mui/material';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#6470cd',
    },
    secondary: {
      main: '#6470cd',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

export default customTheme;
