const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../config/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass
      }
    });

    // Test connection on system load
    this.transporter.verify((error, success) => {
      if (error) {
        logger.error(`[Email Service] SMTP verification failed: ${error.message}`);
      } else {
        logger.info('[Email Service] SMTP connection established successfully');
      }
    });
  }

  async sendEmail({ to, subject, text, html, replyTo }) {
    const msg = {
      from: env.smtp.from,
      to,
      subject,
      text,
      html,
      replyTo
    };
    
    try {
      logger.info(`[Email Service] Dispatching email to recipient: ${to}`);
      const info = await this.transporter.sendMail(msg);
      logger.info(`[Email Service] Message delivered successfully: ${info.messageId}`);
      return info;
    } catch (err) {
      logger.error(`[Email Service] Nodemailer sendMail operation failed for ${to}`, err);
      throw err;
    }
  }

  async sendAdminInquiryAlert(formData, aiSummary) {
    const { name, email, subject: subjectField, message, projectType, budget } = formData;
    
    const subject = subjectField && subjectField.trim() 
      ? `${subjectField} — ${name}` 
      : `New contact from ${name}`;
      
    const text = `Name: ${name}\nEmail: ${email}\nSubject: ${subjectField || 'N/A'}\nProject Type: ${projectType || 'N/A'}\nBudget: ${budget || 'N/A'}\n\nSummary:\n${aiSummary}\n\nFull Message:\n${message}`;
    
    const html = `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subjectField || 'N/A'}</p><p><strong>Project Type:</strong> ${projectType || 'N/A'}</p><p><strong>Budget:</strong> ${budget || 'N/A'}</p><p><strong>Summary:</strong></p><p>${aiSummary.replace(/\n/g, '<br/>')}</p><p><strong>Full Message:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>`;
    
    return this.sendEmail({
      to: env.smtp.to,
      subject,
      text,
      html,
      replyTo: email
    });
  }

  async sendUserAutoReply(userEmail, customBody) {
    const replySubject = 'Thanks for reaching out! — Sahaduddin Portfolio';
    
    const replyText = customBody || 'Thank you for your message. I have received it and will get back to you soon.';
    const replyHtml = customBody 
      ? `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; font-size: 15px;">${customBody.replace(/\n/g, '<br/>')}</div>`
      : '<p>Thank you for your message. I have received it and will get back to you soon.</p>';
    
    return this.sendEmail({
      to: userEmail,
      subject: replySubject,
      text: replyText,
      html: replyHtml
    });
  }
}

module.exports = new EmailService();
