// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({ fullname: '', role: '' });
  const [attendanceList, setAttendanceList] = useState([]);
  const [marksList, setMarksList] = useState([]);
  const [feesList, setFeesList] = useState([]);
  const role = localStorage.getItem('role');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }
    loadUserAndData();
  }, []);

  const loadUserAndData = async () => {
    try {
      const token = localStorage.getItem('token');
      const profileRes = await fetch('http://localhost:8000/authservice/profile', {
        headers: { 'Token': token }
      });
      const profile = await profileRes.json();
      if (profile.code === 200) {
        localStorage.setItem('fullname', profile.fullname);
        localStorage.setItem('email', profile.email);
        setUserInfo({
          fullname: profile.fullname,
          role: profile.role === 1 ? 'Student' : (profile.role === 2 ? 'Teacher' : 'Admin')
        });

        if (profile.role === 1) {
          const studentEmail = profile.email;
          const att = JSON.parse(localStorage.getItem(`attendance_${studentEmail}`) || '[]');
          const marks = JSON.parse(localStorage.getItem(`marks_${studentEmail}`) || '[]');
          const fees = JSON.parse(localStorage.getItem(`fees_${studentEmail}`) || '[]');
          setAttendanceList(att);
          setMarksList(marks);
          setFeesList(fees);
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  // Styles
  const containerStyle = { marginLeft: '250px', padding: '20px', fontFamily: 'Arial' };
  const cardStyle = { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' };
  const statsContainerStyle = { display: 'flex', gap: '20px', marginBottom: '30px' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px' };
  const thStyle = { padding: '12px', background: '#343a40', color: 'white', textAlign: 'left' };
  const tdStyle = { padding: '10px', borderBottom: '1px solid #ddd' };

  if (role !== '1') {
    return (
      <div>
        <Navbar />
        <div style={containerStyle}>
          <h1>Welcome, {userInfo.fullname}!</h1>
          <p>Role: {userInfo.role}</p>
          <div style={cardStyle}>
            <p>Admin/Teacher Dashboard – Manage students from "Students" page.</p>
          </div>
        </div>
      </div>
    );
  }

  // Student view
  return (
    <div>
      <Navbar />
      <div style={containerStyle}>
        <h1>Welcome, {userInfo.fullname}!</h1>
        <p>Role: Student</p>

        <div style={statsContainerStyle}>
          <div style={cardStyle}><h3>Attendance</h3><p style={{fontSize:'24px', color:'#17a2b8'}}>{attendanceList.length} records</p></div>
          <div style={cardStyle}><h3>Marks</h3><p style={{fontSize:'24px', color:'#28a745'}}>{marksList.length} entries</p></div>
          <div style={cardStyle}><h3>Fees</h3><p style={{fontSize:'24px', color:'#fd7e14'}}>{feesList.length} transactions</p></div>
        </div>

        <h3>My Attendance</h3>
        <table style={tableStyle}>
          <thead><tr><th style={thStyle}>Date</th><th style={thStyle}>Status</th><th style={thStyle}>Marked By</th></tr></thead>
          <tbody>
            {attendanceList.length === 0 ? <tr><td colSpan="3" style={tdStyle}>No attendance records</td></tr> :
              attendanceList.map((a, i) => <tr key={i}><td style={tdStyle}>{a.date}</td><td style={tdStyle}>{a.status}</td><td style={tdStyle}>{a.teacher}</td></tr>)
            }
          </tbody>
        </table>

        <h3>My Marks</h3>
        <table style={tableStyle}>
          <thead><tr><th style={thStyle}>Course</th><th style={thStyle}>Exam</th><th style={thStyle}>Marks</th><th style={thStyle}>Grade</th></tr></thead>
          <tbody>
            {marksList.length === 0 ? <tr><td colSpan="4" style={tdStyle}>No marks records</td></tr> :
              marksList.map((m, i) => <tr key={i}><td style={tdStyle}>{m.courseName}</td><td style={tdStyle}>{m.examName}</td><td style={tdStyle}>{m.marksObtained}/{m.maxMarks}</td><td style={tdStyle}>{m.grade}</td></tr>)
            }
          </tbody>
        </table>

        <h3>My Fee Details</h3>
        <table style={tableStyle}>
          <thead><tr><th style={thStyle}>Fee Type</th><th style={thStyle}>Amount</th><th style={thStyle}>Due Date</th><th style={thStyle}>Status</th></tr></thead>
          <tbody>
            {feesList.length === 0 ? <tr><td colSpan="4" style={tdStyle}>No fee records</td></tr> :
              feesList.map((f, i) => <tr key={i}><td style={tdStyle}>{f.feeType}</td><td style={tdStyle}>₹{f.amount}</td><td style={tdStyle}>{f.dueDate}</td><td style={tdStyle}>{f.status}</td></tr>)
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;