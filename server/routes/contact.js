const express = require('express');
const Message = require('../models/Message');
const { sendContactEmail } = require('../config/mailer');

const router = express.Router();

// Simple in-memory rate limiter: 3 messages / 10 min / IP
const hits = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const entry = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  if (entry.length >= 3) {
    return res.status(429).json({ error: 'RATE_LIMITED // try again later' });
  }
  entry.push(now);
  hits.set(ip, entry);
  next();
}

// POST /api/contact — store a message
router.post('/', rateLimit, async (req, res, next) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'VALIDATION // name, email and message are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'VALIDATION // invalid email' });
    }
    const details = {
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim()
    };

    await sendContactEmail(details);

    let saved;
    try {
      saved = await Message.create(details);
    } catch (dbError) {
      console.error(`[CONTACT] Email sent, but message was not saved: ${dbError.message}`);
    }

    res.status(201).json({ ok: true, id: saved?._id || null, delivered: true });
  } catch (err) {
    if (err.code === 'SMTP_NOT_CONFIGURED') {
      return res.status(503).json({ error: 'EMAIL_SERVICE_NOT_CONFIGURED' });
    }
    console.error(`[CONTACT] Email delivery failed: ${err.message}`);
    return res.status(502).json({ error: 'EMAIL_DELIVERY_FAILED' });
  }
});

module.exports = router;
