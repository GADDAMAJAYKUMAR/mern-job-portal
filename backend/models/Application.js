import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: String,
  studentEmail: String,
});

export default mongoose.model('Application', applicationSchema);