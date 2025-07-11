// models/Job.js
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  skills: String,
  stipend: String,
  applyUrl: String,
  postedBy: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
});


jobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Job', jobSchema);
