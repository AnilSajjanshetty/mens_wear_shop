import React from 'react';
import { Link } from 'react-router-dom';

const NavbarGuest = () => (
  <nav className="navbar navbar-expand-lg navbar-light" style={{ background: 'linear-gradient(135deg, #8a2be2, #ff1493)' }}>
    <div className="container">
      <Link to="/" className="navbar-brand" style={{ color: '#fff', fontWeight: 'bold' }}>
        श्रद्धा मेन्स वेअर
      </Link>
      <div className="ml-auto">
        <button className="btn btn-outline-light mx-2" onClick={() => window.location.href = '/login'}>
          Login
        </button>
        <button className="btn btn-outline-light" onClick={() => window.location.href = '/register'}>
          Register
        </button>
      </div>
    </div>
  </nav>
);

export default NavbarGuest;
