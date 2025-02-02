import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material'; // Import Box from @mui/material
import Header from '../components/Header';
import Footer from '../components/Footer';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const Profile = () => {
  // State to manage profile data and loading/error states
  const [profileData, setProfileData] = useState({
    teacher_name: '',
    role: '',
    address: '',
    phone_number: '',
    avatarUrl: '' // Placeholder for avatar (you can change this if needed)
  });
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Fetch teacher data when the component mounts
    const fetchTeacherData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/teachers/`);
        // Assuming the response contains the teacher data (adjust depending on your API structure)
        const data = response.data[0]; // Assuming it returns an array, get the first item
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        setError('Failed to load teacher data.');
      }
    };

    fetchTeacherData();
  }, []);

  return (
    <Container className="py-5" style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
       <Header /> 
      <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
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
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="p-4 shadow-sm">
            <div className="text-center">
              <Image
                src={profileData.avatarUrl || 'https://via.placeholder.com/100'}
                roundedCircle
                style={{ width: '100px', height: '100px' }}
                alt={profileData.teacher_name}
                className="mb-3"
              />
              <h3 className="fw-bold">{profileData.t_name}</h3>
              <p className="text-muted mb-1">{profileData.address}</p>
              <p className="text-muted">{profileData.phone}</p>
            </div>

            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Box>
      </Box>
      <Footer /> 
    </Container>
  );
};

export default Profile;
