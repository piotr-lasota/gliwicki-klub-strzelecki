import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    type: 'light'
  },
  typography: {
    fontFamily: ['Titillium Web', 'sans-serif'].join(',')
  }
});

export default theme;
