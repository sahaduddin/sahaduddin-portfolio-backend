const { BadRequestError } = require('../utils/errors');

function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];
    const body = req.body || {};
    
    Object.keys(schema).forEach(key => {
      const rules = schema[key];
      const val = body[key];
      
      // Required validation check
      if (rules.required && (val === undefined || val === null || (typeof val === 'string' && val.trim() === ''))) {
        errors.push(`'${key}' is required`);
        return;
      }
      
      // Email validation check
      if (rules.isEmail && val) {
        const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailRe.test(val)) {
          errors.push(`'${key}' must be a valid email address`);
        }
      }
    });
    
    if (errors.length > 0) {
      return next(new BadRequestError(errors.join('. ')));
    }
    
    next();
  };
}

module.exports = validateBody;
