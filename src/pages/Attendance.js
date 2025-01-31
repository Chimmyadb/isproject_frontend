import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Modal, Form, Alert, Pagination, } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { BsPencilSquare } from "react-icons/bs";
import { Box, Card, CardContent, Container, Typography} from '@mui/material'; // Import Box from @mui/material
import Header from '../components/Header';
import Sidebar from "../components/Sidebar";
import Footer from '../components/Footer';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add' or 'edit'
  const [currentRecord, setCurrentRecord] = useState({});
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [weeklyAttendance, setWeeklyAttendance] = useState({
    labels: [],
    datasets: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const API_URL = "http://127.0.0.1:8000/api";

  const fetchData = useCallback(async () => {
    try {
      const [attendanceResponse, studentsResponse, subjectsResponse, classroomsResponse] =
        await Promise.all([
          axios.get(`${API_URL}/attendances/`),
          axios.get(`${API_URL}/students/`),
          axios.get(`${API_URL}/subjects/`),
          axios.get(`${API_URL}/classrooms/`),
        ]);

      setAttendanceData(attendanceResponse.data);
      setStudents(studentsResponse.data);
      setSubjects(subjectsResponse.data);
      setClassrooms(classroomsResponse.data);

      const weeklyData = processWeeklyAttendance(attendanceResponse.data);
      setWeeklyAttendance(weeklyData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAlert({ show: true, message: "Failed to fetch data.", variant: "danger" });
    }
  }, []);

  const processWeeklyAttendance = (data) => {
    if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };

    const weekMap = {};
    data.forEach((record) => {
      const week = new Date(record.date).toLocaleString("en-US", {
        year: "numeric",
        week: "numeric",
      });
      if (!weekMap[week]) {
        weekMap[week] = { Present: 0, Absent: 0 };
      }
      weekMap[week][record.status] += 1;
    });

    const labels = Object.keys(weekMap).sort();
    const presentData = labels.map((week) => weekMap[week].Present || 0);
    const absentData = labels.map((week) => weekMap[week].Absent || 0);

    return {
      labels,
      datasets: [
        { label: "Present", data: presentData, backgroundColor: "rgba(4, 108, 22, 0.97)" },
        { label: "Absent", data: absentData, backgroundColor: "rgb(192, 8, 11)" },
      ],
    };
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = attendanceData?.slice(indexOfFirstRecord, indexOfLastRecord) || [];
  const totalPages = Math.ceil(attendanceData.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSave = async () => {
    try {
      if (
        !currentRecord.student ||
        !currentRecord.subject ||
        !currentRecord.classroom ||
        !currentRecord.date ||
        !currentRecord.status
      ) {
        setAlert({ show: true, message: "All fields are required.", variant: "warning" });
        return;
      }

      if (modalType === "add") {
        await axios.post(`${API_URL}/attendances/`, currentRecord);
        setAlert({ show: true, message: "Attendance added successfully!", variant: "success" });
      } else {
        await axios.put(`${API_URL}/attendance/${currentRecord.id}/`, currentRecord);
        setAlert({ show: true, message: "Attendance updated successfully!", variant: "success" });
      }

      fetchData();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving attendance:", error.response?.data || error.message);
      setAlert({ show: true, message: "Failed to save attendance.", variant: "danger" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRecord((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container className="container mt-5">
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
        <Typography
        variant="h4"
        sx={{textAlign: "right", fontFamily:"sans-serif", mb:3}}> Attendance List</Typography>
      
      {/* <h1 className="text-center">Attendance List</h1> */}
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <Button
        variant="success"
        onClick={() => {
          setModalType("add");
          setCurrentRecord({});
          setShowModal(true);
        }}
      >
        Add Attendance
      </Button>
      <Card sx={{borderRadius:"10px", boxShadow: 3}}>
        <CardContent>
          <Table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Classroom</th>
                <th>Subject</th>
                <th>Date</th>
                {/* <th>Reason</th> */}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.student_name}</td>
                    <td>{record.classroom_name}</td>
                    <td>{record.subject}</td>             
                    <td>{record.date}</td>
                    {/* <td>{record.reason}</td> */}
                    <td>{record.status}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => {
                          setModalType("edit");
                          setCurrentRecord(record);
                          setShowModal(true);
                        }}
                      >
                        <BsPencilSquare />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No records available.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
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
      <h2 className="text-center mt-5"> Attendance Report</h2>
      <Bar
        data={weeklyAttendance}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Weekly Attendance" },
          },
        }}
      />
  </CardContent>
  </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === "add" ? "Add Attendance" : "Edit Attendance"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Student</Form.Label>
              <Form.Select
                name="student"
                value={currentRecord.student || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Select
                name="subject"
                value={currentRecord.subject || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Classroom</Form.Label>
              <Form.Select
                name="classroom"
                value={currentRecord.classroom || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Classroom</option>
                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={currentRecord.date || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={currentRecord.status || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={currentRecord.reason || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>

        </Modal.Footer>
      </Modal>
      </Box>
      </Box>
      <Footer />
    </Container>

  );
};

export default Attendance;