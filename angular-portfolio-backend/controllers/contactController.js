const { sendEmail } = require('../utils/email');
const db = require('../config/db');

function validateContact(body) {
  const { name, email, message } = body || {};
  if (!name || !email || !message) return false;
  // simple email regex
  const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return emailRe.test(email);
}

async function handleContact(req, res) {
  const { name, email, subject: subjectField, message } = req.body || {};
  if (!validateContact(req.body)) {
    return res.status(400).json({ error: 'name, email and message are required and email must be valid' });
  }

  try {
    // compose email
    const subject = subjectField && subjectField.trim() ? `${subjectField} — ${name}` : `New contact from ${name}`;
    const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const html = `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>`;
    await sendEmail({ to: process.env.CONTACT_TO || process.env.SMTP_USER, subject, text, html, replyTo: email });

    // optional: store in DB (non-blocking)
    const sql = 'INSERT INTO contact_messages (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, NOW())';
    try {
      await db.query(sql, [name, email, subjectField || null, message]);
    } catch (e) {
      // log but don't fail the request
      console.error('DB insert failed', e);
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('contact handler error', err);
    return res.status(500).json({ error: 'internal error' });
  }
}

module.exports = { handleContact };
