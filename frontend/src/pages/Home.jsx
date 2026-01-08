import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './MarkdownStyles.css';

function Home() {
    const [infoContent, setInfoContent] = useState('');

    useEffect(() => {
        fetch('/md/info.md')
            .then(res => res.text())
            .then(text => setInfoContent(text))
            .catch(err => console.error('Error loading markdown:', err));
    }, []);

    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Welcome to the Community
            </h1>

            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                <Link to="/login" className="link" style={{ padding: '1rem 2rem', fontSize: '1.1rem', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', textDecoration: 'none', color: 'white' }}>
                    Sign In
                </Link>
            </div>

            <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div className="glass-card">
                    <h3 style={{ color: 'var(--primary-color)' }}>Secure</h3>
                    <p>State-of-the-art security with encrypted sessions and secure connections.</p>
                </div>

                {infoContent && (
                    <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                        <h3 style={{ color: 'var(--accent-color)' }}>Team Info</h3>
                        <div className="markdown-content" style={{ textAlign: 'left' }}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{infoContent}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
