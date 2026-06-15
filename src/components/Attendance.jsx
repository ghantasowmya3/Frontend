import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Attendance.css';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with API call
      const mockStudents = [
        { id: 1, rollNumber: 'SIS2024001', fullname: 'Alice Student', course: 'Computer Science' },
        { id: 2, rollNumber: 'SIS2024002', fullname: 'Bob Student', course: 'Computer Science' },
        { id: 3, rollNumber: 'SIS2024003', fullname: 'Charlie Student', course: 'Computer Science' },
      ];
      setStudents(mockStudents);
      
      // Initialize attendance
      const initialAttendance = {};
      mockStudents.forEach(student => {
        initialAttendance[student.id] = 'present';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance({
      ...attendance,
      [studentId]: status
    });
  };

  const handleSubmit = async () => {
    const attendanceData = {
      date: selectedDate,
      records: Object.keys(attendance).map(studentId => ({
        studentId: parseInt(studentId),
        status: attendance[studentId]
      }))
    };
    
    console.log('Saving attendance:', attendanceData);
    alert('Attendance saved successfully! (Demo)');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="attendance-page">
      <Navbar onLogout={handleLogout} />
      <div className="attendance-content">
        <div className="attendance-header">
          <h2>Attendance Management</h2>
          <div className="date-selector">
            <label>Date: </label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="attendance-table">
          <table>
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Course</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.rollNumber}</td>
                  <td>{student.fullname}</td>
                  <td>{student.course}</td>
                  <td>
                    <select 
                      value={attendance[student.id]} 
                      onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="attendance-actions">
          <button onClick={handleSubmit} className="btn-save">Save Attendance</button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;