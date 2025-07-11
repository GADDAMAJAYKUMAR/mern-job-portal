// models/StudentProfile.js
import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    degree: { type: String },
    branch: { type: String },
    year: { type: String },
    linkedin: { type: String },
    github: { type: String },
    bio: { type: String },
    skills: { type: [String], default: [] },
    resumeUrl: { type: String },
    photoUrl: { type: String },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);

export default StudentProfile;
