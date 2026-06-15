import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Feedback.css';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(5);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, avgRating: 0, pending: 0, resolved: 0 });
  const role = localStorage.getItem('role');

  useEffect(() => {
    loadFeedbacks();
    loadStats();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/authservice/feedback/all', {
        headers: { 'Token': token }
      });
      const data = await response.json();
      if (data.code === 200) {
        setFeedbacks(data.data || []);
      }
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/authservice/feedback/stats', {
        headers: { 'Token': token }
      });
      const data = await response.json();
      if (data.code === 200 && data.data) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const submitFeedback = async () => {
    if (!subject.trim() || !message.trim()) {
      alert('Please enter both subject and message');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/authservice/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Token': token
        },
        body: JSON.stringify({ rating, subject, message })
      });
      const data = await response.json();
      if (data.code === 200) {
        alert('✅ Feedback submitted successfully!');
        setSubject('');
        setMessage('');
        setRating(5);
        loadFeedbacks();
        loadStats();
      } else {
        alert(data.message || 'Error submitting feedback');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting feedback');
    }
  };

  const replyToFeedback = async (id) => {
    const reply = prompt('Enter your reply:');
    if (!reply) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/authservice/feedback/reply/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Token': token
        },
        body: JSON.stringify({ reply })
      });
      const data = await response.json();
      if (data.code === 200) {
        alert('✅ Reply added successfully!');
        loadFeedbacks();
      } else {
        alert(data.message || 'Error adding reply');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding reply');
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/authservice/feedback/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Token': token }
      });
      const data = await response.json();
      if (data.code === 200) {
        alert('✅ Feedback deleted successfully!');
        loadFeedbacks();
        loadStats();
      } else {
        alert(data.message || 'Error deleting feedback');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting feedback');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: '#ffc107',
      reviewed: '#17a2b8',
      resolved: '#28a745',
      rejected: '#dc3545'
    };
    return {
      background: colors[status] || '#6c757d',
      color: 'white',
      padding: '3px 8px',
      borderRadius: '3px',
      fontSize: '12px',
      display: 'inline-block'
    };
  };

  const renderStars = () => {
    return (
      <div style={{ display: 'flex', gap: '5px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              fontSize: '30px',
              cursor: 'pointer',
              color: '#ffc107',
              opacity: star <= rating ? 1 : 0.3,
              marginRight: '5px'
            }}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <div className="feedback-container">
        <h2>📝 Student Feedback System (MongoDB)</h2>

        {/* Stats Cards */}
        <div className="feedback-stats">
          <div className="stat-card">
            <h4>Total Feedbacks</h4>
            <p className="stat-number">{stats.total || 0}</p>
          </div>
          <div className="stat-card">
            <h4>Average Rating</h4>
            <p className="stat-number">{(stats.avgRating || 0).toFixed(1)} ★</p>
          </div>
          <div className="stat-card">
            <h4>Pending</h4>
            <p className="stat-number">{stats.pending || 0}</p>
          </div>
          <div className="stat-card">
            <h4>Resolved</h4>
            <p className="stat-number">{stats.resolved || 0}</p>
          </div>
        </div>

        {/* Submit Feedback - Only for Students */}
        {role === '1' && (
          <div className="feedback-card">
            <h3>Submit Your Feedback</h3>
            {renderStars()}
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="feedback-input"
            />
            <textarea
              placeholder="Your feedback message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="feedback-textarea"
            ></textarea>
            <button className="btn-submit" onClick={submitFeedback}>
              Submit Feedback
            </button>
          </div>
        )}

        {/* All Feedbacks */}
        <div className="feedback-card">
          <h3>All Feedbacks (Stored in MongoDB)</h3>
          {loading ? (
            <p>Loading...</p>
          ) : feedbacks.length === 0 ? (
            <p>No feedbacks yet.</p>
          ) : (
            feedbacks.map((fb) => (
              <div key={fb._id} className="feedback-item">
                <div className="feedback-header">
                  <div>
                    <strong>{fb.studentName}</strong>
                    <span className="feedback-email">({fb.studentEmail})</span>
                  </div>
                  <div>
                    <span style={getStatusBadge(fb.status)}>{fb.status}</span>
                  </div>
                </div>
                <div className="feedback-rating">
                  {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                  <strong> {fb.subject}</strong>
                </div>
                <p className="feedback-message">{fb.message}</p>
                <small className="feedback-date">{new Date(fb.createdAt).toLocaleString()}</small>
                
                {fb.reply && (
                  <div className="feedback-reply">
                    <strong>Reply:</strong> {fb.reply}
                  </div>
                )}
                
                {(role === '3' || role === '2') && fb.status !== 'resolved' && (
                  <button className="btn-reply" onClick={() => replyToFeedback(fb._id)}>
                    Reply
                  </button>
                )}
                {role === '3' && (
                  <button className="btn-delete-feedback" onClick={() => deleteFeedback(fb._id)}>
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* MongoDB Info */}
        <div className="info-card">
          <h4>📌 Why MongoDB for Feedback?</h4>
          <ul>
            <li>✅ No complex relationships with other tables</li>
            <li>✅ Flexible schema - can add new fields anytime</li>
            <li>✅ High write volume - thousands of students submit feedback</li>
            <li>✅ Perfect for this use case</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Feedback;