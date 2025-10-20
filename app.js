require('dotenv').config();
const express = require('express');
const cors = require('cors');

const contactRoutes = require('./routes/contact');

const app = express();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://sahaduddin.github.io/Sahaduddin-portfolio/']
    : ['http://localhost:4200', 'http://localhost:3000'],
  credentials: true
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
