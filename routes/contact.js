const express = require('express');
const router = express.Router();
const { handleContact } = require('../controllers/contact.controller');
const validateBody = require('../middlewares/validate.middleware');

// Injected validation schema constraints
const contactSchema = {
  name: { required: true },
  email: { required: true, isEmail: true },
  subject: { required: true },
  message: { required: true },
  projectType: { required: true },
  budget: { required: true }
};

router.post('/', validateBody(contactSchema), handleContact);

module.exports = router;
