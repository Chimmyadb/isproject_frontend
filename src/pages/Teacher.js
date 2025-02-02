import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material'; // Import Box from @mui/material
import { Table, Container, Alert, Pagination, Card } from "react-bootstrap";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const authToken = localStorage.getItem("access_token");
  const navigate = useNavigate(); // For navigation

  // Redirect to login if no auth token
  useEffect(() => {
    if (!authToken) {
      navigate("/login"); // Redirect to the login page
    }
  }, [authToken, navigate]);

  // Fetch teachers data
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/teachers/`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setTeachers(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          // Handle unauthorized error
          setError("You are not authorized. Please log in.");
          localStorage.removeItem("access_token"); // Clear invalid token
          navigate("/"); // Redirect to login
        } else {
          console.error("Error fetching teachers:", error);
          setError("Failed to fetch teachers. Please try again.");
        }
      }
    };
    fetchTeachers();
  }, [authToken, navigate]);

  // Calculate pagination
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const paginatedTeachers = teachers.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(teachers.length / recordsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container className="py-5">
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
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Card containing the table */}
          <Card sx={{ borderRadius: "10px", boxShadow: 3 }}>
            <Card.Body>
              <Card.Title>Teachers List</Card.Title>
              <Table striped bordered hover responsive>
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Teacher Name</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTeachers.map((teacher, index) => (
                    <tr key={teacher.id}>
                      <td>{firstIndex + index + 1}</td>
                      <td>{teacher.t_name}</td>
                      <td>{teacher.address}</td>
                      <td>{teacher.phone}</td>
                      <td>{teacher.role}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              <Pagination className="justify-content-center">
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </Card.Body>
          </Card>

        </Box>
      </Box>
      <Footer />
    </Container>
  );
};

export default Teacher;
