import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
    const { user, loading } = useAuth();
    const [jobId, setJobId] = useState(null);
    const [jobStatus, setJobStatus] = useState(null);
    const [jobLogs, setJobLogs] = useState([]);

    // Polling effect
    useEffect(() => {
        let interval;
        if (jobId && jobStatus !== 'Completed') {
            interval = setInterval(async () => {
                try {
                    const res = await fetch(`/api/job/${jobId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setJobStatus(data.status);
                        setJobLogs(data.logs || []);
                        if (data.status === 'Completed') {
                            clearInterval(interval);
                        }
                    }
                } catch (error) {
                    console.error("Polling failed", error);
                }
            }, 2000); // Poll every 2 seconds
        }
        return () => clearInterval(interval);
    }, [jobId, jobStatus]);

    const handleStartJob = async () => {
        try {
            const res = await fetch('/api/job', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                setJobId(data.job_id);
                setJobStatus('Running');
                setJobLogs(['Job started...']);
            }
        } catch (error) {
            console.error("Failed to start job", error);
        }
    };

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Status Dot Color logic
    let dotColor = 'gray';
    let pulse = false;
    if (jobStatus === 'Running') {
        dotColor = '#eab308'; // Yellow
        pulse = true;
    } else if (jobStatus === 'Completed') {
        dotColor = '#22c55e'; // Green
    }

    return (
        <div className="container dashboard-container">
            <div className="glass-card">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">
                        Dashboard
                    </h1>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3 className="card-title">User Profile</h3>
                        <div className="profile-info">
                            <span className="profile-label">Username:</span>
                            <span className="profile-value">{user.username}</span>
                        </div>
                        <div className="status-section">
                            <span className="profile-label">Status:</span>
                            <span className="status-active">Active</span>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <h3 className="card-title">Long Running Job</h3>
                        <p className="job-description">Execute a background task with live logging.</p>

                        <div className="job-controls">
                            <button onClick={handleStartJob} className="btn-primary" disabled={jobStatus === 'Running'}>
                                {jobStatus === 'Running' ? 'Job Running...' : 'Start Job'}
                            </button>

                            {/* Status Indicator with Hover Tooltip */}
                            <div className="status-container" title={`Status: ${jobStatus || 'Idle'}`}>
                                <div className="status-dot" style={{
                                    backgroundColor: dotColor,
                                    boxShadow: pulse ? `0 0 0 0 rgba(234, 179, 8, 0.7)` : 'none',
                                    animation: pulse ? 'pulse 2s infinite' : 'none'
                                }}></div>
                                {jobStatus && <span className="status-text" style={{ color: dotColor }}>{jobStatus}</span>}

                                {/* Live Log Tooltip */}
                                {jobLogs.length > 0 && (
                                    <div className="tooltip">
                                        <div className="tooltip-header">
                                            Job Logs (Live)
                                        </div>
                                        {jobLogs.map((log, index) => (
                                            <div key={index} className="log-entry">
                                                <span className="log-arrow">&gt;</span>
                                                {log}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
