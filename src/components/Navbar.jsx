import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const role = localStorage.getItem('role');

  const menus = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠', show: true },
    { name: 'Students', path: '/students', icon: '👨‍🎓', show: role === '3' || role === '2' },
    { name: 'Feedback', path: '/feedback', icon: '📝', show: true },  // Add this line
    { name: 'Profile', path: '/profile', icon: '👤', show: true },
    { name: 'Users', path: '/users', icon: '👥', show: role === '3' },
  ];

  const navbarStyle = {
    position: 'fixed', left: 0, top: 0, width: '250px', height: '100vh',
    background: '#2c3e50', color: 'white', display: 'flex', flexDirection: 'column'
  };
  const brandStyle = { padding: '20px', textAlign: 'center', borderBottom: '1px solid #34495e' };
  const menuStyle = { flex: 1, padding: '20px 0' };
  const linkStyle = {
    display: 'flex', alignItems: 'center', padding: '12px 20px',
    color: '#ecf0f1', textDecoration: 'none', transition: '0.3s'
  };
  const activeStyle = { background: '#667eea' };
  const footerStyle = { padding: '20px', borderTop: '1px solid #34495e', textAlign: 'center' };
  const logoutBtnStyle = {
    background: '#e74c3c', color: 'white', border: 'none',
    padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', width: '100%'
  };

  return (
    <div style={navbarStyle}>
      <div style={brandStyle}><h2>SIS Portal</h2></div>
      <div style={menuStyle}>
        {menus.filter(m => m.show).map(menu => (
          <Link
            key={menu.path}
            to={menu.path}
            style={{
              ...linkStyle,
              ...(location.pathname === menu.path ? activeStyle : {})
            }}
          >
            <span style={{ marginRight: '10px' }}>{menu.icon}</span> {menu.name}
          </Link>
        ))}
      </div>
      <div style={footerStyle}>
        <button style={logoutBtnStyle} onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;