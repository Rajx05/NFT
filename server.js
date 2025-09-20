const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();

// Supabase client
const supabaseUrl = 'https://dkzkvvrnyovowqhxltyu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRremt2dnJueW92b3dxaHhsdHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzOTE2OTAsImV4cCI6MjA3Mzk2NzY5MH0.QN5OWczHa2DGVVIJLaoBMW6IDOICiglzgv6i_QQf2rM';
const supabase = createClient(supabaseUrl, supabaseKey);

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Example: Route for login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Example: Route for register page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const { data, error } = await supabase.auth.signUp({
    email: username,
    password: password,
  });
  if (error) return res.send('Registration failed: ' + error.message);
  res.send('Registration successful!');
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password: password,
  });
  if (error) return res.send('Login failed: ' + error.message);
  res.send('Login successful!');
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