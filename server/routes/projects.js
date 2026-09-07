const express = require('express');
const Project = require('../models/Project');

const router = express.Router();

// GET /api/projects — public list, ordered
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    res.json({ count: projects.length, data: projects });
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:code — single project (PROJECT_01)
router.get('/:code', async (req, res, next) => {
  try {
    const project = await Project.findOne({ code: req.params.code });
    if (!project) return res.status(404).json({ error: 'PROJECT_NOT_FOUND' });
    res.json({ data: project });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
