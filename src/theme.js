// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue color for primary elements
    },
    secondary: {
      main: '#f50057', // Pink color for secondary elements
    },
    background: {
      default: '#f4f6f8', // Light background color
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h6: {
      fontWeight: 600, // Custom font weight for headings
    },
  },
});

export default theme;
