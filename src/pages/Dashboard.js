import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import hamImage from '../assets/ham.jpg';
import oipImage from '../assets/OIP.jpg';
import rImage from '../assets/R.jpg';

const Dashboard = () => {
  const cards = [
    {
      title: 'School',
      image: hamImage,
      description: 'School is a place where dreams take root and grow into achievements! Heres to a year full of learning, friendship, and fun. Believe in yourself, work hard, and make it amazing!'
    },
    {
      title: 'Magufuli Secondary School',
      image: rImage,
      description: 'School is a place where dreams take root and grow into achievements. Believe in yourself, work hard, and make it amazing!'
    },
    {
      title: 'School',
      image: oipImage,
      description: 'School is a place where dreams take root and grow into achievements! Heres to a year full of learning, friendship, and fun. Believe in yourself, work hard, and make it amazing!'
    },
    {
      title: 'School',
      image: hamImage,
    },
    {
      title: 'Magufuli Secondary School',
      image: rImage,
      
    },
    {
      title: 'School',
      image: oipImage,
      
    }

    
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header /> 
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: 3,
            marginLeft: { xs: 0, sm: '240px' }, // Adjust for sidebar width
            transition: 'margin 0.3s ease-in-out', // Optional animation
          }}
        >
          <Typography variant="h4" align="center" sx={{ margin: 2, paddingTop: 10 }}>
            Welcome to the Dashboard
          </Typography>
          <Grid container spacing={2}>
            {cards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={card.image}
                    alt={card.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <Footer /> {/* Footer at the bottom */}
    </Box>
  );
};

export default Dashboard;