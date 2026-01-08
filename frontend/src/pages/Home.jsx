import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Welcome to the Community
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
                Test Environment.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                <Link to="/register" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                    Join Now
                </Link>
                <Link to="/login" className="link" style={{ padding: '1rem 2rem', fontSize: '1.1rem', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', textDecoration: 'none', color: 'white' }}>
                    Sign In
                </Link>
            </div>

            <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div className="glass-card">
                    <h3 style={{ color: 'var(--primary-color)' }}>Secure</h3>
                    <p>State-of-the-art security with encrypted sessions and secure connections.</p>
                </div>
                <div className="glass-card">
                    <h3 style={{ color: 'var(--accent-color)' }}>Fast</h3>
                    <p>Built with Go for high-performance and low-latency responses.</p>
                </div>
                <div className="glass-card">
                    <h3 style={{ color: 'var(--secondary-color)' }}>Modern</h3>
                    <p>Experience a beautiful interface designed with the latest web standards.</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
