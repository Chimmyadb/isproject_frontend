import React, { useState } from 'react';
import { List, ListItem, ListItemText, Drawer, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { BsHouseAdd } from 'react-icons/bs';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { BsBookFill } from 'react-icons/bs';
import MenuIcon from '@mui/icons-material/Menu'; 
import ExitToAppIcon from '@mui/icons-material/ExitToApp';



const Sidebar = () => {
  const [open, setOpen] = useState(false); // State to control the sidebar visibility

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* Hamburger Icon Button to toggle sidebar */}
      <IconButton
        color="dark"
        sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1300 }}
        onClick={toggleSidebar}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer (Sidebar) */}
      <Drawer
      
        open={open} 
        onClose={toggleSidebar} 
         // Make the sidebar slide in and out
        variant="temporary"
        anchor="left" // Position the sidebar to the left
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ padding: 2 }}>
          <ListItem button >
            <ListItemText primary="Teacher Dashboard" sx={{marginRight:2, paddingLeft: 4}} />
          </ListItem>
        </Box>
        <List>
          <ListItem button component={Link} to="/dashboard">
            <HomeIcon sx={{ marginRight: 2 }} /> 
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/student">
            <PeopleIcon sx={{ marginRight: 2 }} /> 
            <ListItemText primary="Students" />
          </ListItem>
          <ListItem button component={Link} to="/teacher">
            <PeopleIcon sx={{ marginRight: 2 }} /> 
            <ListItemText primary="Teacher" />
          </ListItem>
          <ListItem button style={{marginRight:'20px'}} component={Link} to="/subject">
            <BsBookFill style={{ marginRight: '25px'}} /> 
            <ListItemText primary="Subjects" />
          </ListItem>
          <ListItem button component={Link} to="/classlevel">
            <BsHouseAdd style={{ marginRight: '25px' }} /> 
            <ListItemText primary="Class" />
          </ListItem>
          <ListItem button component={Link} to="/attendance">
            <CheckCircleIcon sx={{ marginRight: 2 }} /> 
            <ListItemText primary="Attendances" />
          </ListItem>
          <ListItem button component={Link} to="/">
            <ExitToAppIcon sx={{ marginRight: 2 }} />
            <ListItemText primary="Logout" />
          </ListItem>
         
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
