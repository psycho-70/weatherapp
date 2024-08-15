import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.jsx';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import './index.css';
import { AppProvider } from './appContext.jsx';
import { SnackbarProvider } from 'notistack';

// Creating a dark theme using createTheme
const darkTheme = createTheme({
  palette: {
    // Uncomment the mode to enable dark mode
    // mode: 'dark',
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
 
    <ThemeProvider theme={darkTheme}>
        <SnackbarProvider maxSnack={3}>

      <CssBaseline />
      <Router>
        <AppProvider>
         
          <App />
         
        </AppProvider>

      </Router>
      </SnackbarProvider>

    </ThemeProvider>
  
);
