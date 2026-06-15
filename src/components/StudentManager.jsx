// src/components/StudentManager.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalType, setModalType] = useState('');
  const [message, setMessage] = useState('');
  const role = localStorage.getItem('role');

  // Form states
  const [studentForm, setStudentForm] = useState({ fullname: '', email: '', phone: '', course: '', semester: '' });
  const [attendanceForm, setAttendanceForm] = useState({ date: new Date().toISOString().split('T')[0], status: 'present' });
  const [marksForm, setMarksForm] = useState({ courseName: '', examName: '', marksObtained: '', maxMarks: '100' });
  const [feesForm, setFeesForm] = useState({ feeType: 'Tuition Fee', amount: '', dueDate: '' });

  // Fetch real students from backend (via FastAPI)
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/authservice/getallusers/1/100', {
        headers: { 'Token': token }
      });
      const data = await response.json();
      if (data.code === 200 && data.users) {
        const studentUsers = data.users.filter(user => user.role === 1);
        const studentsWithProfile = studentUsers.map(user => ({
          id: user.id,
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          rollNumber: `SIS${user.id}`,
          course: 'Computer Science',
          semester: 1
        }));
        setStudents(studentsWithProfile);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Helper to save student profile (using email as key)
  const updateStudentProfile = (student) => {
    const profiles = JSON.parse(localStorage.getItem('student_profiles') || '{}');
    profiles[student.email] = {
      rollNumber: student.rollNumber,
      course: student.course,
      semester: student.semester
    };
    localStorage.setItem('student_profiles', JSON.stringify(profiles));
  };

  const handleAddStudent = () => {
    setStudentForm({ fullname: '', email: '', phone: '', course: '', semester: '' });
    setModalType('add');
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setStudentForm(student);
    setModalType('edit');
    setShowModal(true);
  };

  const handleDeleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
    setMessage('Student removed from view (backend not deleted)');
    setTimeout(() => setMessage(''), 2000);
  };

  const saveStudentRecord = () => {
    if (modalType === 'add') {
      setMessage('Please use Signup page to create new student accounts.');
    } else {
      const updated = students.map(s => s.id === studentForm.id ? studentForm : s);
      setStudents(updated);
      updateStudentProfile(studentForm);
      setMessage('Student updated!');
    }
    setShowModal(false);
    setTimeout(() => setMessage(''), 2000);
  };

  // Attendance functions – use email as key
  const openAttendance = (student) => {
    setSelectedStudent(student);
    setAttendanceForm({ date: new Date().toISOString().split('T')[0], status: 'present' });
    setModalType('attendance');
    setShowModal(true);
  };

  const saveAttendance = () => {
    const key = `attendance_${selectedStudent.email}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const newRecord = {
      date: attendanceForm.date,
      status: attendanceForm.status,
      teacher: localStorage.getItem('fullname') || 'Teacher'
    };
    existing.push(newRecord);
    localStorage.setItem(key, JSON.stringify(existing));
    setMessage(`✅ Attendance marked for ${selectedStudent.fullname} (${selectedStudent.email})`);
    setShowModal(false);
    setTimeout(() => setMessage(''), 2000);
  };

  // Marks functions
  const openMarks = (student) => {
    setSelectedStudent(student);
    setMarksForm({ courseName: '', examName: '', marksObtained: '', maxMarks: '100' });
    setModalType('marks');
    setShowModal(true);
  };

  const saveMarks = () => {
    const key = `marks_${selectedStudent.email}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const percentage = (marksForm.marksObtained / marksForm.maxMarks) * 100;
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B+';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C';
    else if (percentage >= 40) grade = 'D';
    const newRecord = {
      courseName: marksForm.courseName,
      examName: marksForm.examName,
      marksObtained: marksForm.marksObtained,
      maxMarks: marksForm.maxMarks,
      percentage: percentage.toFixed(1),
      grade: grade,
      date: new Date().toISOString().split('T')[0]
    };
    existing.push(newRecord);
    localStorage.setItem(key, JSON.stringify(existing));
    setMessage(`✅ Marks added for ${selectedStudent.fullname} (${selectedStudent.email})`);
    setShowModal(false);
    setTimeout(() => setMessage(''), 2000);
  };

  // Fees functions
  const openFees = (student) => {
    setSelectedStudent(student);
    setFeesForm({ feeType: 'Tuition Fee', amount: '', dueDate: '' });
    setModalType('fees');
    setShowModal(true);
  };

  const saveFees = () => {
    const key = `fees_${selectedStudent.email}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const newRecord = {
      feeType: feesForm.feeType,
      amount: parseFloat(feesForm.amount),
      dueDate: feesForm.dueDate,
      paid: 0,
      status: 'pending',
      dateAdded: new Date().toISOString().split('T')[0]
    };
    existing.push(newRecord);
    localStorage.setItem(key, JSON.stringify(existing));
    setMessage(`✅ Fee record added for ${selectedStudent.fullname} (${selectedStudent.email})`);
    setShowModal(false);
    setTimeout(() => setMessage(''), 2000);
  };

  // Styles (inline)
  const containerStyle = { marginLeft: '250px', padding: '20px', fontFamily: 'Arial' };
  const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
  const addBtnStyle = { background: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' };
  const thStyle = { padding: '12px', textAlign: 'left', background: '#343a40', color: 'white' };
  const tdStyle = { padding: '12px', borderBottom: '1px solid #dee2e6' };
  const editBtn = { background: '#ffc107', padding: '5px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' };
  const deleteBtn = { background: '#dc3545', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' };
  const attBtn = { background: '#17a2b8', color: 'white', padding: '5px 8px', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' };
  const marksBtn = { background: '#28a745', color: 'white', padding: '5px 8px', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' };
  const feesBtn = { background: '#fd7e14', color: 'white', padding: '5px 8px', border: 'none', borderRadius: '3px', cursor: 'pointer' };
  const messageStyle = { background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' };
  const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalContent = { background: 'white', padding: '25px', borderRadius: '8px', width: '400px', maxWidth: '90%' };
  const inputStyle = { width: '100%', padding: '8px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' };
  const modalBtn = { background: '#007bff', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', width: '100%' };

  const renderModal = () => {
    if (!showModal) return null;
    if (modalType === 'add' || modalType === 'edit') {
      return (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>{modalType === 'add' ? 'Add Student' : 'Edit Student'}</h3>
            <input style={inputStyle} placeholder="Full Name" value={studentForm.fullname} onChange={e => setStudentForm({...studentForm, fullname: e.target.value})} />
            <input style={inputStyle} placeholder="Email" value={studentForm.email} onChange={e => setStudentForm({...studentForm, email: e.target.value})} />
            <input style={inputStyle} placeholder="Phone" value={studentForm.phone} onChange={e => setStudentForm({...studentForm, phone: e.target.value})} />
            <input style={inputStyle} placeholder="Course" value={studentForm.course} onChange={e => setStudentForm({...studentForm, course: e.target.value})} />
            <input style={inputStyle} placeholder="Semester" value={studentForm.semester} onChange={e => setStudentForm({...studentForm, semester: e.target.value})} />
            <button style={modalBtn} onClick={saveStudentRecord}>Save</button>
            <button style={{...modalBtn, background: '#6c757d', marginTop: '5px'}} onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      );
    }
    if (modalType === 'attendance') {
      return (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Mark Attendance - {selectedStudent?.fullname}</h3>
            <label>Date</label>
            <input type="date" style={inputStyle} value={attendanceForm.date} onChange={e => setAttendanceForm({...attendanceForm, date: e.target.value})} />
            <label>Status</label>
            <select style={inputStyle} value={attendanceForm.status} onChange={e => setAttendanceForm({...attendanceForm, status: e.target.value})}>
              <option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option>
            </select>
            <button style={modalBtn} onClick={saveAttendance}>Save Attendance</button>
            <button style={{...modalBtn, background: '#6c757d'}} onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      );
    }
    if (modalType === 'marks') {
      return (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Add Marks - {selectedStudent?.fullname}</h3>
            <input style={inputStyle} placeholder="Course Name" value={marksForm.courseName} onChange={e => setMarksForm({...marksForm, courseName: e.target.value})} />
            <input style={inputStyle} placeholder="Exam Name" value={marksForm.examName} onChange={e => setMarksForm({...marksForm, examName: e.target.value})} />
            <input style={inputStyle} type="number" placeholder="Marks Obtained" value={marksForm.marksObtained} onChange={e => setMarksForm({...marksForm, marksObtained: e.target.value})} />
            <input style={inputStyle} type="number" placeholder="Max Marks" value={marksForm.maxMarks} onChange={e => setMarksForm({...marksForm, maxMarks: e.target.value})} />
            <button style={modalBtn} onClick={saveMarks}>Save Marks</button>
            <button style={{...modalBtn, background: '#6c757d'}} onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      );
    }
    if (modalType === 'fees') {
      return (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Add Fee - {selectedStudent?.fullname}</h3>
            <select style={inputStyle} value={feesForm.feeType} onChange={e => setFeesForm({...feesForm, feeType: e.target.value})}>
              <option>Tuition Fee</option><option>Hostel Fee</option><option>Library Fee</option><option>Exam Fee</option>
            </select>
            <input style={inputStyle} type="number" placeholder="Amount (₹)" value={feesForm.amount} onChange={e => setFeesForm({...feesForm, amount: e.target.value})} />
            <input style={inputStyle} type="date" placeholder="Due Date" value={feesForm.dueDate} onChange={e => setFeesForm({...feesForm, dueDate: e.target.value})} />
            <button style={modalBtn} onClick={saveFees}>Add Fee</button>
            <button style={{...modalBtn, background: '#6c757d'}} onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Navbar />
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2>Student Manager</h2>
          {(role === '3' || role === '2') && <button style={addBtnStyle} onClick={handleAddStudent}>+ Add Student</button>}
        </div>
        {message && <div style={messageStyle}>{message}</div>}
        <table style={tableStyle}>
          <thead>
            <tr><th style={thStyle}>ID</th><th style={thStyle}>Name</th><th style={thStyle}>Email</th><th style={thStyle}>Course</th><th style={thStyle}>Semester</th><th style={thStyle}>Actions</th>{(role === '3' || role === '2') && <th style={thStyle}>Manage</th>}</tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td style={tdStyle}>{s.id}</td><td style={tdStyle}>{s.fullname}</td><td style={tdStyle}>{s.email}</td><td style={tdStyle}>{s.course}</td><td style={tdStyle}>{s.semester}</td>
                <td style={tdStyle}>
                  <button style={editBtn} onClick={() => handleEditStudent(s)}>Edit</button>
                  <button style={deleteBtn} onClick={() => handleDeleteStudent(s.id)}>Delete</button>
                </td>
                {(role === '3' || role === '2') && (
                  <td style={tdStyle}>
                    <button style={attBtn} onClick={() => openAttendance(s)}>📝 Attendance</button>
                    <button style={marksBtn} onClick={() => openMarks(s)}>📊 Marks</button>
                    <button style={feesBtn} onClick={() => openFees(s)}>💰 Fees</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderModal()}
    </div>
  );
};

export default StudentManager;