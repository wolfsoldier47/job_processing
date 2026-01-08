import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import Modal from './Modal';
import './Navbar.css';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="nav-brand">Community</Link>
                <div className="nav-links">
                    <button onClick={() => setIsAboutOpen(true)} className="link" style={{ marginRight: '1rem', background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}>
                        About
                    </button>
                    {user ? (
                        <div className="nav-links-container">
                            <span className="nav-user-info">Hi, {user.username}</span>
                            <Link to="/dashboard" className="link">Dashboard</Link>
                            <Link to="/jobs" className="link">Jobs</Link>
                            <button onClick={handleLogout} className="btn-primary nav-logout-btn">Logout</button>
                        </div>
                    ) : (
                        <div className="nav-links-container">
                            <Link to="/login" className="link">Login</Link>
                            <Link to="/register" className="btn-primary">Get Started</Link>
                        </div>
                    )}
                </div>
            </nav>

            <Modal
                isOpen={isAboutOpen}
                onClose={() => setIsAboutOpen(false)}
                title="About"
            >
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Thanks to Mr. Leon</p>
                    <span style={{ fontSize: '3rem' }}>❤️</span>
                </div>
            </Modal>
        </>
    );
}

export default Navbar;
