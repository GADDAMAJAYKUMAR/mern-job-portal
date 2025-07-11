import React, { useState, useEffect } from 'react';
import './MyProfile.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    fullName: localStorage.getItem('name') || '',
    email: localStorage.getItem('email') || '',
    role: localStorage.getItem('role') || '',
    degree: '',
    branch: '',
    year: '',
    linkedin: '',
    github: '',
    bio: '',
    skills: [],
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);

  // ========== Fetch profile on load ==========
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/user/profile/me?email=${profile.email}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();

        setProfile(prev => ({
          ...prev,
          fullName: data.name || prev.fullName,
          email: data.email || prev.email,
          role: data.role || prev.role,
          degree: data.education || '',
          branch: data.branch || '',
          year: data.year || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          bio: data.bio || '',
          skills: data.skills || [],
        }));

        if (data.profilePic) {
          setPhotoPreview(`http://localhost:5000/uploads/${data.profilePic}`);
        }
        if (data.resume) {
          setResumePreview(`http://localhost:5000/uploads/${data.resume}`);
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
      }
    };

    if (profile.email) {
      fetchUserProfile();
    }
  }, [profile.email]);

  // ========== Handlers ==========
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSkillsChange = (e) => {
    const skillArray = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    setProfile({ ...profile, skills: skillArray });
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setResumePreview(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // ========== Submit ==========
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', profile.email);
    formData.append('name', profile.fullName);
    formData.append('role', profile.role);
    formData.append('skills', profile.skills.join(','));
    formData.append('education', profile.degree);
    formData.append('branch', profile.branch);
    formData.append('year', profile.year);
    formData.append('linkedin', profile.linkedin);
    formData.append('github', profile.github);
    formData.append('bio', profile.bio);

    if (resumeFile) formData.append('resume', resumeFile);
    if (photo) formData.append('profilePic', photo);

    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/user/profile/upload`, {
        method: 'POST',
        body: formData,
      });
      setLoading(false);

      if (res.ok) {
        alert('✅ Profile saved successfully');
      } else {
        alert('❌ Failed to save profile');
      }
    } catch (err) {
      setLoading(false);
      alert('❌ Error submitting profile');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <h2 className="text-center mb-4">👤 Student Profile</h2>
      {loading && <div className="text-center mb-3">⏳ Saving profile...</div>}

      <div className="text-center mb-4">
        <img
          src={photoPreview}
          className="rounded-circle border shadow"
          alt="Profile"
          style={{ width: 120, height: 120, objectFit: 'cover' }}
        />
        <div className="mt-2">
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
        </div>
        <h4 className="mt-2">{profile.fullName || 'Your Name'}</h4>
        <p className="text-muted">{profile.email || 'your.email@example.com'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label>Degree</label>
            <input type="text" className="form-control" name="degree" value={profile.degree} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Branch</label>
            <input type="text" className="form-control" name="branch" value={profile.branch} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Year</label>
            <input type="text" className="form-control" name="year" value={profile.year} onChange={handleChange} />
          </div>
          <div className="col-12">
            <label>Skills</label>
            <input type="text" className="form-control" name="skills" value={profile.skills.join(', ')} onChange={handleSkillsChange} />
          </div>
          <div className="col-12">
            <label>Resume</label>
            <input type="file" className="form-control" accept=".pdf" onChange={handleResumeUpload} />
            {resumePreview && (
              <>
                <iframe src={resumePreview} title="Resume" className="w-100 mt-2" style={{ height: 200 }} />
                <a href={resumePreview} download className="btn btn-link">Download Resume</a>
              </>
            )}
          </div>
          <div className="col-md-6">
            <label>LinkedIn</label>
            <input type="url" className="form-control" name="linkedin" value={profile.linkedin} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>GitHub</label>
            <input type="url" className="form-control" name="github" value={profile.github} onChange={handleChange} />
          </div>
          <div className="col-12">
            <label>Bio</label>
            <textarea name="bio" rows="3" className="form-control" value={profile.bio} onChange={handleChange}></textarea>
          </div>
          <div className="col-12 mt-3">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentProfile;
