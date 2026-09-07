const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    code:       { type: String, required: true, unique: true },   // PROJECT_01
    title:      { type: String, required: true },
    category:   { type: String, default: 'WEB APPLICATION' },
    problem:    { type: String, required: true },
    role:       { type: String, default: 'Full-Stack Developer' },
    tech:       { type: [String], default: [] },
    solution:   { type: String, required: true },
    result:     { type: String, default: '' },
    liveUrl:    { type: String, default: '' },
    repoUrl:    { type: String, default: '' },
    featured:   { type: Boolean, default: false },
    order:      { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
