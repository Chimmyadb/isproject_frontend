import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container, Alert, Modal, Form, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsPencilSquare, BsPlus } from 'react-icons/bs';
import Sidebar from '../components/Sidebar';
import { Box} from '@mui/material'; // Import Box from @mui/material
import Header from '../components/Header';
import Footer from '../components/Footer';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const Students = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({});
  const [newStudent, setNewStudent] = useState({
    name: '',
    age: '',
    gender: '',
    address: '',
    guardian_name: '',
    guardian_phone_number: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${baseUrl}/students/`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to fetch students. Please try again.');
      }
    };
    fetchStudents();
  }, []);

  // Calculate pagination
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const paginatedStudents = students.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(students.length / recordsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Set current student for update
  const handleUpdate = (student) => {
    setCurrentStudent(student);
    setShowUpdateModal(true);
  };

  // Handle input change for both insert and update forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showUpdateModal) {
      setCurrentStudent((prevStudent) => ({ ...prevStudent, [name]: value }));
    } else {
      setNewStudent((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Insert a student
  const insertStudent = async () => {
    try {
      const response = await axios.post(`${baseUrl}/students/`, newStudent);
      setStudents((prevStudents) => [...prevStudents, response.data]);
      setShowInsertModal(false);
    } catch (error) {
      console.error('Error inserting student:', error);
      setError('Failed to insert student. Please try again later.');
    }
  };

  // Update student
  const updateStudent = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}/student/${currentStudent.id}/`,
        currentStudent
      );
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === currentStudent.id ? response.data : student
        )
      );
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating student:', error);
      setError('Failed to update student. Please try again later.');
    }
  };

  return (
    <Container className="py-5">
      <Header /> {/* Include Header */}
      <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
        <Sidebar /> {/* Include Sidebar */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: 3,
            marginLeft: { xs: 0, sm: '240px' }, // Adjust for sidebar width
            transition: 'margin 0.3s ease-in-out', // Optional animation
          }}
        >
      <h1 className="text-center mb-4">Student List</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Insert Button */}
      <Button variant="success" className="mb-3" onClick={() => setShowInsertModal(true)}>
        <BsPlus /> Insert Student
      </Button>

      {/* Student Table */}
      {students.length > 0 ? (
     
        <Table className='table table-bordered table-hover'>
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Guardian Name</th>
              <th>Guardian Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student, index) => (
              <tr key={student.id}>
                <td>{firstIndex + index + 1}</td>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.gender}</td>
                <td>{student.address}</td>
                <td>{student.guardian_name}</td>
                <td>{student.guardian_phone_number}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleUpdate(student)}>
                    <BsPencilSquare />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center">No students available.</p>
      )}

      {/* Pagination */}
      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>

      {/* Insert Modal */}
      <Modal show={showInsertModal} onHide={() => setShowInsertModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Insert New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="studentName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter student name"
                name="name"
                value={newStudent.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="studentAge" className="mt-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter student age"
                name="age"
                value={newStudent.age}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="studentGender" className="mt-3">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter student gender"
                name="gender"
                value={newStudent.gender}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="studentAddress" className="mt-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter student address"
                name="address"
                value={newStudent.address}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="studentGuardianName" className="mt-3">
              <Form.Label>Guardian Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter guardian name"
                name="guardian_name"
                value={newStudent.guardian_name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="studentGuardianPhone" className="mt-3">
              <Form.Label>Guardian Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter guardian phone number"
                name="guardian_phone_number"
                value={newStudent.guardian_phone_number}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInsertModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={insertStudent}>
            Insert
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="studentName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter student name"
                name="name"
                value={currentStudent.name || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="studentAge" className="mt-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter student age"
                name="age"
                value={currentStudent.age || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="studentGender" className="mt-3">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter student gender"
                name="gender"
                value={currentStudent.gender || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="studentAddress" className="mt-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter student address"
                name="address"
                value={currentStudent.address || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="studentGuardianName" className="mt-3">
              <Form.Label>Guardian Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter guardian name"
                name="guardian_name"
                value={currentStudent.guardian_name || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="studentGuardianPhone" className="mt-3">
              <Form.Label>Guardian Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter guardian phone number"
                name="guardian_phone_number"
                value={currentStudent.guardian_phone_number || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={updateStudent}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      </Box>
      </Box>
      <Footer /> {/* Include Footer */}
    </Container>
  );
};

export default Students;
