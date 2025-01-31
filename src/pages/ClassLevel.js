import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container, Alert, Modal, Form, Pagination } from 'react-bootstrap';
import { BsPencilFill, BsPlusCircle } from 'react-icons/bs';
import Sidebar from '../components/Sidebar';
import {  Box } from '@mui/material'; // Import Box from @mui/material
import Header from '../components/Header';
import Footer from '../components/Footer';

const ClassLevel = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentClass, setCurrentClass] = useState({
    id: null,
    name: '',
    subject: '',
  });
  const [newClass, setNewClass,isUpdate] = useState({
    name: '',
    subject: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;



  useEffect(()=>{
    fetchClassroom();
    fetchSubject();
  }, []);

  const fetchClassroom = async () =>{
    try{
      const response = await axios.get("http://localhost:8000/api/classrooms/");
      setClasses(response.data);
    }catch (error) {
      setError("Failed to fetch classroom.");
      console.error(error);
    }
  };

  const fetchSubject = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/subjects/");
      setSubjects(response.data);
    } catch (error) {
      setError("Failed to fetch subject.");
      console.error(error);
    }
  };
 

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const paginatedClasses = classes.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(classes.length / recordsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleInputChange = (e, isUpdate = false) => {
    const { name, value } = e.target;
    if (isUpdate) {
      setCurrentClass((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewClass((prev) => ({ ...prev, [name]: value }));
    }
  };
  //insert a class
  const insertClass = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/classrooms/', newClass);
      setClasses((prev) => [...prev, response.data]);
      setNewClass({ name: '', subject: '' });
      setShowInsertModal(false);
    } catch (error) {
      setError('Failed to insert classroom. Please try again later.');
      console.error('Error inserting classroom:', error);
    }
  };


  const openUpdateModal = (classData) => {
    setCurrentClass({
      id: classData.id,
      name: classData.name,
      subject: classData.subjects?.[0]?.id || '', // Handle single subject or default to empty
    });
    setShowUpdateModal(true);
  };
  
  const updateClass = async () => {
    try {
      const updatedClass = {
        ...currentClass,
        subjects: [currentClass.subject], // Send subject as an array of IDs
      };
  
      const response = await axios.put(
        `http://localhost:8000/api/classroom/${currentClass.id}/`,
        updatedClass
      );
  
      setClasses((prev) =>
        prev.map((cls) => (cls.id === currentClass.id ? response.data : cls))
      );
      setCurrentClass({ id: null, name: '', subject: '' });
      setShowUpdateModal(false);
    } catch (error) {
      setError('Failed to update classroom. Please try again later.');
      console.error('Error updating classroom:', error);
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
      <h1 className="text-center mb-4">Class Levels</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      <Button variant='success' className="mb-3" onClick={() => setShowInsertModal(true)}>
        <BsPlusCircle /> Add Class
      </Button>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Class Name</th>
            {/* <th>Subject</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedClasses.length > 0 ? (
            paginatedClasses.map((classData, index) => (
              <tr key={classData.id}>
                <td>{firstIndex + index + 1}</td>
                <td>{classData.name}</td>
                  {/* <td>
                    {classData.subjects && classData.subjects.length > 0
                      ? classData.subjects.map((subject) => subject.subject_name).join(', '):''}
                  </td> */}

                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => openUpdateModal(classData)}
                  >
                    <BsPencilFill /> Edit
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No classrooms available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    

      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
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
        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
  
      {/* Insert Modal */}
      <Modal show={showInsertModal} onHide={() => setShowInsertModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Insert New Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
           
              <Form.Group controlId="name">
              <Form.Label>Class Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter class name"
                name="name"
                value={newClass.name}
                onChange={(e) => handleInputChange(e, false)}
              />
            </Form.Group>

            <Form.Group controlId="subject" className="mt-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              as="select"
              name="subject"
              value={isUpdate ? currentClass.subject : newClass.subject}
              onChange={(e) => handleInputChange(e, isUpdate)}
            >
              <option value="">Select Subject</option>
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.id}>
                  {subj.subject_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInsertModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={insertClass}>
            Insert
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Class Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter class name"
                name="name"
                value={currentClass.name}
                onChange={(e) => handleInputChange(e, true)}
              />
            </Form.Group>
            <Form.Group controlId="subject" className="mt-3">
              <Form.Label>Subject</Form.Label>
             
              <Form.Control
                as="select"
                name="subject"
                value={currentClass.subject}
                onChange={(e) => handleInputChange(e, true)}
              > 
                <option value="">Select Subject</option>
                {subjects.map((subj) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.subject_name}
                  </option>
                ))}
            </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={updateClass}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      </Box>
      </Box>
      <Footer /> 
    </Container>
  );
};

export default ClassLevel;
