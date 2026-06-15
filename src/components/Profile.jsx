// src/components/Profile.jsx
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';

const Profile = () => {
  const [profile, setProfile] = useState({ fullname: '', email: '', role: '' });
  useEffect(() => {
    setProfile({
      fullname: localStorage.getItem('fullname') || 'User',
      email: localStorage.getItem('email') || '',
      role: localStorage.getItem('role') === '1' ? 'Student' : (localStorage.getItem('role') === '2' ? 'Teacher' : 'Admin')
    });
  }, []);
  return (
    <div>
      <Navbar />
      <div style={{ marginLeft: '250px', padding: '20px' }}>
        <h2>My Profile</h2>
        <p><strong>Name:</strong> {profile.fullname}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
      </div>
    </div>
  );
};
export default Profile;