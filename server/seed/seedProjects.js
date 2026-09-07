/*
  Seed the projects collection.
  Usage: npm run seed   (requires MONGO_URI in .env)
*/
require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project');

const projects = [
  {
    code: 'PROJECT_01',
    title: 'ISURU Service Center — Billing System',
    category: 'DESKTOP SOFTWARE // CLIENT PROJECT',
    problem: 'A service station needed a reliable offline billing and management system covering customers, vehicles, stock and invoicing without depending on the internet.',
    role: 'Software Engineer — design, development, delivery',
    tech: ['C#', '.NET', 'WPF', 'MVVM', 'SQLite'],
    solution: 'Built a comprehensive offline billing and management system with secure invoicing, inventory and service tracking, role-based access, a real-time analytics dashboard and integrated printing support.',
    result: 'Deployed as production software for a live client — daily billing, stock and reporting handled entirely offline.',
    featured: true,
    order: 1
  },
  {
    code: 'PROJECT_02',
    title: 'LMS Platform',
    category: 'FULL-STACK WEB APPLICATION',
    problem: 'Learning content and student progress were scattered across files and chats, with no single place to manage courses, assignments and results.',
    role: 'Full-Stack Developer',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs'],
    solution: 'Designed a MERN learning management platform with course modules, role-based dashboards for students and lecturers, assignment submission and progress analytics.',
    result: 'A unified platform replacing fragmented workflows — course delivery and grading in one system.',
    featured: true,
    order: 2
  },
  {
    code: 'PROJECT_03',
    title: 'Android Workflow App',
    category: 'MOBILE APPLICATION',
    problem: 'A daily workflow needed to be captured on mobile — offline-first, with local data that syncs cleanly and a UI that stays fast on low-end devices.',
    role: 'Mobile Developer',
    tech: ['Kotlin', 'Room', 'MVVM', 'Jetpack'],
    solution: 'Engineered an offline-first Android application using Room for local persistence and MVVM architecture, with a clean single-activity navigation structure.',
    result: 'Reliable daily capture with zero network dependency and a maintainable, testable codebase.',
    featured: false,
    order: 3
  },
  {
    code: 'PROJECT_04',
    title: 'Analytics Toolkit',
    category: 'DATA & ANALYTICS',
    problem: 'Raw operational data needed quick statistical analysis and readable reporting without heavyweight tooling.',
    role: 'Developer / Analyst',
    tech: ['Python', 'FastAPI', 'R', 'Pandas'],
    solution: 'Built a lightweight analytics toolkit — a FastAPI service for data ingestion paired with R scripts for statistical summaries and reporting.',
    result: 'Repeatable analysis pipelines that turn raw exports into decision-ready summaries.',
    featured: false,
    order: 4
  }
];

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ravindu_portfolio';
  await mongoose.connect(uri);
  await Project.deleteMany({});
  await Project.insertMany(projects);
  console.log(`[SEED] Inserted ${projects.length} projects`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('[SEED] Failed:', err.message);
  process.exit(1);
});
