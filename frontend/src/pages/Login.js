import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Container, Box, TextField, Button,
  Typography, Paper, Alert
} from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email, password
      });
      login(res.data.token, res.data.username);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8 }}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Welcome Back 👋
          </Typography>
          <Typography textAlign="center" color="text.secondary" mb={3}>
            Login to your account
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email" type="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              margin="normal" required
            />
            <TextField
              fullWidth label="Password" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              margin="normal" required
            />
            <Button
              fullWidth type="submit" variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
            >
              Login
            </Button>
          </form>
          <Typography textAlign="center">
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#1976d2', fontWeight: 'bold' }}>
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;