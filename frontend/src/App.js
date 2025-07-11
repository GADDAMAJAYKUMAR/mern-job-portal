import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

import RecruiterDashboard from './pages/RecruiterDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/forgot';
import PostJob from './pages/PostJob';
import ManageJobs from './pages/ManageJobs';
import JobParser from './pages/JobParser';
import MyProfile from './studentComponent/myProfile';
import AppliedJobs from './studentComponent/appliedJobs';
import SavedJobs from './studentComponent/savedJobs';

const App = () => (
  <Router>
   <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/dashboard" element={<RecruiterDashboard />} />
  <Route path="/jobseeker" element={<JobSeekerDashboard />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forgot" element={<ForgotPassword />} />
  <Route path="/post-job" element={<PostJob />} />
  <Route path="/managejobs" element={<ManageJobs />} /> 
  <Route path="/recruiter/paste-job" element={<JobParser />} />
  <Route path="/jobseeker/myProfile" element={<MyProfile />} />
  <Route path="/jobseeker/appliedJobs" element={<AppliedJobs />} />
  <Route path="/jobseeker/savedJobs" element={<SavedJobs />} />

</Routes>
  </Router>
);

export default App;
