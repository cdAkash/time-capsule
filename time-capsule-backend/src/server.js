import express from 'express';
import { connectToDynamoDB } from './db/index.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Example route
app.get('/health', (req, res) => {
  res.send('Main server is up and running!');
});

// Connect to DynamoDB and start the server
connectToDynamoDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DynamoDB:', err);
  });
