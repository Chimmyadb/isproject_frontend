import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Alert, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../Auth/AuthContext';
import './Login.css'
const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
      const response = await axios.post(`${API_URL}/login/`, {
        username,
        password,
      });

      const { access, refresh } = response.data;
      //save tokens to localstorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      login();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(Object.values(err.response.data).join(' '));
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: '400px', marginTop: '100px',}}>
      <h2 className="login-container mb-4 text-center ">Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin} className="login-form">
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>  
        <Button variant="primary" type="submit" disabled={loading} className="w-100">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
      
    </Container>
  );
};

export default Login;
