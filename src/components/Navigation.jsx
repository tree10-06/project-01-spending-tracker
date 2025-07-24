import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Assessment, Book } from '@mui/icons-material';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static" style={{ backgroundColor: '#4caf50' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700}}>
          💰 Spending Tracker
        </Typography>
        <Box>
          <Button
            color="inherit"
            startIcon={<Assessment />}
            onClick={() => navigate('/spending-tracker')}
            style={{ 
              backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.2)' : 'transparent' 
            }}
          >
            Analytics
          </Button>
          <Button
            color="inherit"
            startIcon={<Book />}
            onClick={() => navigate('/journal')}
            style={{ 
              backgroundColor: location.pathname === '/journal' ? 'rgba(255,255,255,0.2)' : 'transparent' 
            }}
          >
            Journal
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;