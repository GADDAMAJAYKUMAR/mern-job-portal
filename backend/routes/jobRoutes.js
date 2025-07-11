import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import StudentProfile from '../models/StudentProfile.js';

const router = express.Router();

// ========== Multer Setup ==========
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ storage });

// ========== Auth Routes ==========
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role)
    return res.status(400).json({ message: 'All fields are required' });
  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match' });

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ message: 'User already exists' });

  const user = new User({ name, email, password, role });
  await user.save();
  res.json({ message: 'User registered successfully' });
});

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email, role });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ========== Job Routes ==========
router.post('/post', async (req, res) => {
  const { title, company, location, postedBy } = req.body;
  if (!title || !company || !location || !postedBy)
    return res.status(400).json({ message: 'All fields are required' });

  const job = new Job({ title, company, location, postedBy });
  await job.save();
  res.json({ message: 'Job posted successfully', job });
});

router.get('/all', async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

router.get('/by-recruiter/:email', async (req, res) => {
  const jobs = await Job.find({ postedBy: req.params.email });
  res.json(jobs);
});

router.delete('/delete/:id', async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

router.put('/edit/:id', async (req, res) => {
  const { title, company, location } = req.body;
  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    { title, company, location },
    { new: true }
  );
  if (!updatedJob)
    return res.status(404).json({ message: 'Job not found' });

  res.json({ message: 'Job updated', job: updatedJob });
});

router.post('/bulk-post', async (req, res) => {
  const jobs = req.body.jobs;
  const inserted = await Job.insertMany(jobs);
  res.status(201).json({ message: 'Jobs added successfully', data: inserted });
});

router.get('/search', async (req, res) => {
  const { term } = req.query;
  const regex = new RegExp(term, 'i');
  const jobs = await Job.find({
    $or: [{ title: regex }, { company: regex }, { location: regex }],
  });
  res.json(jobs);
});

// ========== Application Routes ==========
router.post('/apply/:jobId', async (req, res) => {
  const { email } = req.body;
  const { jobId } = req.params;

  const already = await Application.findOne({ jobId, studentEmail: email });
  if (already) return res.status(409).json({ message: 'Already applied' });

  const application = new Application({ jobId, studentEmail: email });
  await application.save();
  res.json({ message: 'Applied' });
});

// ========== User Info ==========
router.get('/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========== Profile Upload ==========
router.post('/profile/upload', upload.fields([
  { name: 'resume' },
  { name: 'profilePic' }
]), async (req, res) => {
  const { email, name, phone, skills, education, experience } = req.body;

  try {
    let profile = await StudentProfile.findOne({ email });

    const updatedProfile = {
      email,
      name,
      phone,
      skills: skills.split(',').map(skill => skill.trim()),
      education,
      experience,
      resume: req.files['resume']?.[0]?.filename || '',
      profilePic: req.files['profilePic']?.[0]?.filename || '',
    };

    if (profile) {
      await StudentProfile.updateOne({ email }, updatedProfile);
    } else {
      profile = new StudentProfile(updatedProfile);
      await profile.save();
    }

    res.json({ message: '✅ Profile uploaded/updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Upload failed', error: err.message });
  }
});

// ========== Fetch Profile ==========
router.get('/profile/me', async (req, res) => {
  const userEmail = req.query.email;

  if (!userEmail) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const profile = await StudentProfile.findOne({ email: userEmail });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

export default router;
