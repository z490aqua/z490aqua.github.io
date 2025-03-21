const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist/public')));

// For any other routes, serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`The Bala game is running on port ${PORT}`);
  console.log(`Open your browser and navigate to http://localhost:${PORT}`);
});