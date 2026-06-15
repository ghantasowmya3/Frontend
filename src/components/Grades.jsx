import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Grades.css';

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    courseName: '',
    assignmentName: '',
    marksObtained: '',
    maxMarks: '100',
    grade: ''
  });

  useEffect(() => {
    loadStudents();
    loadGrades();
  }, []);

  const loadStudents = async () => {
    try {
      // Mock data - replace with API call
      const mockStudents = [
        { id: 1, rollNumber: 'SIS2024001', fullname: 'Alice Student' },
        { id: 2, rollNumber: 'SIS2024002', fullname: 'Bob Student' },
      ];
      setStudents(mockStudents);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadGrades = async () => {
    try {
      // Mock data - replace with API call
      const mockGrades = [
        { id: 1, studentId: 1, studentName: 'Alice Student', courseName: 'Mathematics', assignmentName: 'Midterm Exam', marksObtained: 85, maxMarks: 100, grade: 'A' },
        { id: 2, studentId: 1, studentName: 'Alice Student', courseName: 'Physics', assignmentName: 'Final Exam', marksObtained: 78, maxMarks: 100, grade: 'B+' },
      ];
      setGrades(mockGrades);
    } catch (error) {
      console.error('Error loading grades:', error);
    }
  };

  const calculateGrade = (marks, maxMarks) => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const handleMarksChange = (marks, maxMarks) => {
    const grade = calculateGrade(parseFloat(marks) || 0, parseFloat(maxMarks) || 100);
    setFormData({
      ...formData,
      marksObtained: marks,
      maxMarks: maxMarks,
      grade: grade
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newGrade = {
      id: editingGrade ? editingGrade.id : Date.now(),
      studentId: parseInt(formData.studentId),
      studentName: students.find(s => s.id === parseInt(formData.studentId))?.fullname,
      courseName: formData.courseName,
      assignmentName: formData.assignmentName,
      marksObtained: parseFloat(formData.marksObtained),
      maxMarks: parseFloat(formData.maxMarks),
      grade: formData.grade
    };

    if (editingGrade) {
      setGrades(grades.map(g => g.id === editingGrade.id ? newGrade : g));
      alert('Grade updated successfully!');
    } else {
      setGrades([...grades, newGrade]);
      alert('Grade added successfully!');
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      setGrades(grades.filter(g => g.id !== id));
      alert('Grade deleted successfully!');
    }
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setFormData({
      studentId: grade.studentId.toString(),
      courseName: grade.courseName,
      assignmentName: grade.assignmentName,
      marksObtained: grade.marksObtained.toString(),
      maxMarks: grade.maxMarks.toString(),
      grade: grade.grade
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      courseName: '',
      assignmentName: '',
      marksObtained: '',
      maxMarks: '100',
      grade: ''
    });
    setEditingGrade(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <div className="grades-page">
      <Navbar onLogout={handleLogout} />
      <div className="grades-content">
        <div className="grades-header">
          <h2>Grades Management</h2>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            + Add Grade
          </button>
        </div>

        <div className="grades-table">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Course</th>
                <th>Assignment</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">No grades found</td>
                </tr>
              ) : (
                grades.map((grade) => (
                  <tr key={grade.id}>
                    <td>{grade.studentName}</td>
                    <td>{grade.courseName}</td>
                    <td>{grade.assignmentName}</td>
                    <td>{grade.marksObtained}/{grade.maxMarks}</td>
                    <td><span className="grade-badge">{grade.grade}</span></td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(grade)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(grade.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingGrade ? 'Edit Grade' : 'Add New Grade'}</h3>
                <button className="close" onClick={() => { setShowModal(false); resetForm(); }}>&times;</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Student *</label>
                  <select
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.fullname} ({student.rollNumber})</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Course Name *</label>
                    <input
                      type="text"
                      value={formData.courseName}
                      onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Assignment Name *</label>
                    <input
                      type="text"
                      value={formData.assignmentName}
                      onChange={(e) => setFormData({...formData, assignmentName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Marks Obtained *</label>
                    <input
                      type="number"
                      value={formData.marksObtained}
                      onChange={(e) => handleMarksChange(e.target.value, formData.maxMarks)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Marks *</label>
                    <input
                      type="number"
                      value={formData.maxMarks}
                      onChange={(e) => handleMarksChange(formData.marksObtained, e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Grade (Auto-calculated)</label>
                  <input
                    type="text"
                    value={formData.grade}
                    readOnly
                    style={{ background: '#f5f5f5' }}
                  />
                </div>
                
                <button type="submit" className="btn-submit">{editingGrade ? 'Update Grade' : 'Add Grade'}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grades;