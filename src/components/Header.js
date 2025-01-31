// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ListItem, ListItemText} from '@mui/material';
// import { Button, Form, Alert, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';




const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'primary', // Change the color here
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, paddingLeft:10}}>
          Attendances System
        </Typography>
        <Typography variant='h6' sx={{flexGrow:1, padding: 2 }}>
          Welcome to the Website of Student Attendances 
        </Typography>
        <Button color="inherit" component={Link} to="/profile">
          <ListItem button component={Link} to="/profile">
          <AccountCircleIcon sx={{marginRight:2}}/>
          <ListItemText secondary="T-Profile"/>
        </ListItem> 
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
