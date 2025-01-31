// src/components/HomeCard.js
import React from 'react';
import { Card, CardContent, Typography, CardActionArea, CardMedia } from '@mui/material';

const HomeCard = ({ title, description, image, onClick }) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: '40px',
        padding: '20px',
        boxShadow: '1 4px 8px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          boxShadow: '1 6px 16px rgba(0, 0, 0, 0.2)',
        },
      }}
      onClick={onClick}>
      <CardActionArea>
        <CardMedia
          sx={{
            // Image size for the card
            height: 140, 
          }}
          image={image}
          title={title}
        />
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default HomeCard;
