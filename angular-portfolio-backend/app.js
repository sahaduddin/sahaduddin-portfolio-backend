require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contact');

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*'
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/contact', contactRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal server error' });
});

const port = parseInt(process.env.PORT, 10) || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
