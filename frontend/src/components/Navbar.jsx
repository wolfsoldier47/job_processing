import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">Community</Link>
            <div className="nav-links">
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
    );
}

export default Navbar;
