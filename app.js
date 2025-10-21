require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const contactRoutes = require('./routes/contact');

const app = express();

// Advanced CORS logic to handle array or string for origin
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://sahaduddin.github.io/Sahaduddin-portfolio']
  : ['http://localhost:4200', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.) or allowed web origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Port setup for Railway or fallback to local 3001
const port = parseInt(process.env.PORT, 10) || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
