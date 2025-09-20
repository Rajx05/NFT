const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();

// Supabase client
const supabaseUrl = 'https://dkzkvvrnyovowqhxltyu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRremt2dnJueW92b3dxaHhsdHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzOTE2OTAsImV4cCI6MjA3Mzk2NzY5MH0.QN5OWczHa2DGVVIJLaoBMW6IDOICiglzgv6i_QQf2rM';
const supabase = createClient(supabaseUrl, supabaseKey);

// Backend API URL (for proxy routes)
const API_BASE_URL = 'http://localhost:5000/api';

// Parse JSON and URL-encoded bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Route for register page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

// Route for dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Route for marketplace page
app.get('/marketplace', (req, res) => {
  res.sendFile(path.join(__dirname, 'marketplace.html'));
});

// Route for community page
app.get('/community', (req, res) => {
  res.sendFile(path.join(__dirname, 'community.html'));
});

// Route for analytics page
app.get('/analytics', (req, res) => {
  res.sendFile(path.join(__dirname, 'analytics.html'));
});

// Route for AI studio page
app.get('/ai-studio', (req, res) => {
  res.sendFile(path.join(__dirname, 'ai-studio.html'));
});

// Register route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }
  if (password.length < 8) {
    return res.status(400).send('Password must be at least 8 characters long');
  }

  // Supabase registration
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) return res.status(400).send('Registration failed: ' + error.message);

  res.send('Registration successful!');
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password: password,
  });
  if (error) return res.status(401).send('Login failed: ' + error.message);
  res.send('Login successful!');
});

// API proxy routes to backend
app.get('/api/stories', async (req, res) => {
  try {
    const fetch = require('node-fetch');
    const response = await fetch(`${API_BASE_URL}/stories`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test Supabase connection
(async () => {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) {
    console.error('Supabase connection failed:', error.message);
  } else {
    console.log('Supabase connected successfully!');
  }
})();

// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});