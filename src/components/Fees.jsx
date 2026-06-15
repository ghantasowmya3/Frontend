import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Fees.css';

const Fees = () => {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    feeType: '',
    amount: '',
    paidAmount: '0',
    dueDate: ''
  });

  useEffect(() => {
    loadStudents();
    loadFees();
  }, []);

  const loadStudents = async () => {
    try {
      const mockStudents = [
        { id: 1, rollNumber: 'SIS2024001', fullname: 'Alice Student' },
        { id: 2, rollNumber: 'SIS2024002', fullname: 'Bob Student' },
      ];
      setStudents(mockStudents);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadFees = async () => {
    try {
      const mockFees = [
        { id: 1, studentId: 1, studentName: 'Alice Student', feeType: 'Tuition Fee', amount: 50000, paidAmount: 25000, dueAmount: 25000, dueDate: '2024-12-31', status: 'pending' },
        { id: 2, studentId: 1, studentName: 'Alice Student', feeType: 'Library Fee', amount: 5000, paidAmount: 5000, dueAmount: 0, dueDate: '2024-12-31', status: 'paid' },
      ];
      setFees(mockFees);
    } catch (error) {
      console.error('Error loading fees:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dueAmount = parseFloat(formData.amount) - parseFloat(formData.paidAmount);
    const status = dueAmount <= 0 ? 'paid' : (dueAmount > 0 ? 'pending' : 'pending');
    
    const newFee = {
      id: editingFee ? editingFee.id : Date.now(),
      studentId: parseInt(formData.studentId),
      studentName: students.find(s => s.id === parseInt(formData.studentId))?.fullname,
      feeType: formData.feeType,
      amount: parseFloat(formData.amount),
      paidAmount: parseFloat(formData.paidAmount),
      dueAmount: dueAmount,
      dueDate: formData.dueDate,
      status: status
    };

    if (editingFee) {
      setFees(fees.map(f => f.id === editingFee.id ? newFee : f));
      alert('Fee record updated successfully!');
    } else {
      setFees([...fees, newFee]);
      alert('Fee record added successfully!');
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleRecordPayment = (feeId) => {
    const fee = fees.find(f => f.id === feeId);
    const paymentAmount = prompt(`Enter payment amount for ${fee.studentName} (Due: ₹${fee.dueAmount}):`, fee.dueAmount);
    
    if (paymentAmount && !isNaN(paymentAmount)) {
      const newPaidAmount = fee.paidAmount + parseFloat(paymentAmount);
      const newDueAmount = fee.amount - newPaidAmount;
      const newStatus = newDueAmount <= 0 ? 'paid' : 'pending';
      
      setFees(fees.map(f => 
        f.id === feeId 
          ? { ...f, paidAmount: newPaidAmount, dueAmount: newDueAmount, status: newStatus }
          : f
      ));
      alert(`Payment of ₹${paymentAmount} recorded successfully!`);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      setFees(fees.filter(f => f.id !== id));
      alert('Fee record deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      feeType: '',
      amount: '',
      paidAmount: '0',
      dueDate: ''
    });
    setEditingFee(null);
  };

  const getStatusBadge = (status) => {
    if (status === 'paid') return <span className="status-paid">Paid</span>;
    if (status === 'pending') return <span className="status-pending">Pending</span>;
    return <span className="status-overdue">Overdue</span>;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <div className="fees-page">
      <Navbar onLogout={handleLogout} />
      <div className="fees-content">
        <div className="fees-header">
          <h2>Fees Management</h2>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            + Add Fee Record
          </button>
        </div>

        <div className="fees-summary">
          <div className="summary-card">
            <h4>Total Collection</h4>
            <p className="summary-amount">₹{fees.reduce((sum, f) => sum + f.paidAmount, 0).toLocaleString()}</p>
          </div>
          <div className="summary-card">
            <h4>Total Due</h4>
            <p className="summary-amount">₹{fees.reduce((sum, f) => sum + f.dueAmount, 0).toLocaleString()}</p>
          </div>
          <div className="summary-card">
            <h4>Total Pending</h4>
            <p className="summary-amount">{fees.filter(f => f.status === 'pending').length}</p>
          </div>
        </div>

        <div className="fees-table">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Fee Type</th>
                <th>Total Amount</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">No fee records found</td>
                </tr>
              ) : (
                fees.map((fee) => (
                  <tr key={fee.id}>
                    <td>{fee.studentName}</td>
                    <td>{fee.feeType}</td>
                    <td>₹{fee.amount.toLocaleString()}</td>
                    <td>₹{fee.paidAmount.toLocaleString()}</td>
                    <td>₹{fee.dueAmount.toLocaleString()}</td>
                    <td>{fee.dueDate}</td>
                    <td>{getStatusBadge(fee.status)}</td>
                    <td>
                      {fee.status !== 'paid' && (
                        <button className="btn-payment" onClick={() => handleRecordPayment(fee.id)}>Record Payment</button>
                      )}
                      <button className="btn-delete" onClick={() => handleDelete(fee.id)}>Delete</button>
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
                <h3>{editingFee ? 'Edit Fee Record' : 'Add Fee Record'}</h3>
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
                
                <div className="form-group">
                  <label>Fee Type *</label>
                  <select
                    value={formData.feeType}
                    onChange={(e) => setFormData({...formData, feeType: e.target.value})}
                    required
                  >
                    <option value="">Select Fee Type</option>
                    <option value="Tuition Fee">Tuition Fee</option>
                    <option value="Hostel Fee">Hostel Fee</option>
                    <option value="Library Fee">Library Fee</option>
                    <option value="Exam Fee">Exam Fee</option>
                    <option value="Transport Fee">Transport Fee</option>
                  </select>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Total Amount (₹) *</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Paid Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.paidAmount}
                      onChange={(e) => setFormData({...formData, paidAmount: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    required
                  />
                </div>
                
                <button type="submit" className="btn-submit">{editingFee ? 'Update Fee Record' : 'Add Fee Record'}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fees;