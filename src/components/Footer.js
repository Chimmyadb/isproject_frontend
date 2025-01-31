import React from 'react';
import { Container, Row, Col,  } from 'react-bootstrap';
// import { FaWhatsapp, FaFacebook } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="bg-dark text-white fixed-bottom" style={{ padding: '5px 0' }}>
      <Container>
        <Row className="justify-content-center align-items-center">
          {/* <Col xs={12} md={4} className="text-center">
            <h6>Contact Us</h6>
            <div className="d-flex justify-content-center gap-2"> */}
              {/* WhatsApp Button
              <Button
                variant="success"
                href="https://wa.me/255623883099"
                target="_blank"
                className="py-1 px-1"
                style={{ fontSize: '14px' }}
              >
                <FaWhatsapp className="me-1" />
                WhatsApp
              </Button> */}

              {/* Facebook Button */}
              {/* <Button
                variant="primary"
                href="https://www.facebook.com/adib99542@gmail.com"
                target="_blank"
                className="py-1 px-1"
                style={{ fontSize: '14px' }}
              >
                <FaFacebook className="me-1" />
                Facebook
              </Button> */}
            {/* </div>
          </Col> */}
        </Row>
        <Row>
          <Col className="text-center mt-2">
            <p style={{ fontSize: '12px', margin: '0' }}>
              &copy; 2025 School Attendance. Created by Maryam J. A.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
