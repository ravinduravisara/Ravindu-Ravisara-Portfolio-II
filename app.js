const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./server/config/db');
const projectRoutes = require('./server/routes/projects');
const contactRoutes = require('./server/routes/contact');
const artistRoutes = require('./server/routes/artist');
const { notFound, errorHandler } = require('./server/middleware/errorHandler');

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'client')));

app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/artist-works', artistRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'OK', mode: 'ENGINEERING' }));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
