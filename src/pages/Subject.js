import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Modal, Form, Alert, Pagination } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsPencilSquare, BsPlusCircle } from "react-icons/bs";
import { Card, CardContent, Typography, Box } from "@mui/material"; // Material-UI components
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const Subject = () => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubject, setCurrentSubject] = useState({
    subject_name: "",
    teacher: "",
  });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/subjects/`);
      setSubjects(response.data);
    } catch (error) {
      setError("Failed to fetch subjects.");
      console.error(error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/teachers/`);
      setTeachers(response.data);
    } catch (error) {
      setError("Failed to fetch teachers.");
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (!currentSubject.subject_name || !currentSubject.teacher) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(
          `${baseUrl}/api/subject/${currentSubject.id}/`,
          currentSubject
        );
      } else {
        const response = await axios.post(
          `${baseUrl}/api/subjects/`,
          currentSubject
        );
        setSubjects((prev) => [...prev, response.data]);
      }

      setShowModal(false);
      setCurrentSubject({ subject_name: "", teacher: "" });
      setIsEditing(false);
    } catch (error) {
      setError("Failed to save subject.");
      console.error(error);
    }
  };

  const handleEdit = (subject) => {
    setCurrentSubject(subject);
    setIsEditing(true);
    setShowModal(true);
  };

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const paginatedSubjects = subjects.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(subjects.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container className="py-5">
      <Header />
      <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: 3,
            marginLeft: { xs: 0, sm: "240px" },
            transition: "margin 0.3s ease-in-out",
          }}
        >
          <Typography
            variant="h4"
            sx={{ textAlign: "right", fontFamily: "sans-serif", mb: 3 }}
          >
            Subject List
          </Typography>
          {error && <Alert variant="danger">{error}</Alert>}
          <Button onClick={() => setShowModal(true)} sx={{ mb: 3 }} variant="contained" style={{color:'green'}}>
            <BsPlusCircle /> Add Subject
          </Button>

          {/* Card covering the entire table */}
          <Card sx={{ borderRadius: "10px", boxShadow: 3 }}>
            <CardContent>
              <table className="table table-bordered table-hover ">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Subject Name</th>
                    <th>Teacher</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSubjects.map((subject) => (
                    <tr key={subject.id}>
                      <td>{subject.id}</td>
                      <td>{subject.subject_name}</td>
                      <td>{subject.teacher_name || "N/A"}</td>
                      <td>
                        <Button
                          size="small"
                          style={{color:'orange'}}
                          variant="outlined"
                          onClick={() => handleEdit(subject)}>
                          {<BsPencilSquare /> }Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
            </CardContent>
          </Card>

          {/* Modal for Adding/Editing Subject */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{isEditing ? "Edit Subject" : "Add Subject"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="subjectName">
                  <Form.Label>Subject Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter subject name"
                    value={currentSubject.subject_name}
                    onChange={(e) =>
                      setCurrentSubject({
                        ...currentSubject,
                        subject_name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group controlId="teacher" className="mt-3">
                  <Form.Label>Teacher</Form.Label>
                  <Form.Select
                    value={currentSubject.teacher}
                    onChange={(e) =>
                      setCurrentSubject({ ...currentSubject, teacher: e.target.value })
                    }
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.t_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Box>
      </Box>
      <Footer />
    </Container>
  );
};

export default Subject;
