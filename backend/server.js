require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration (whitelist from FRONTEND_URL environment variable)
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl) or matching whitelist
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// HTTP request logger middleware
app.use(morgan('dev'));

// Body parser with 10kb limit
app.use(express.json({ limit: '10kb' }));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
const barbersRoutes = require('./routes/barbers.routes');

app.use('/api/barbers', barbersRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { app, server };
