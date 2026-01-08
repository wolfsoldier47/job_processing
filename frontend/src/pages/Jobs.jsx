import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './Jobs.css';

function Jobs() {
    const { user, loading } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 10;

    const [selectedJob, setSelectedJob] = useState(null);
    const [loadingLogs, setLoadingLogs] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, [page]);

    const fetchJobs = async () => {
        try {
            const res = await fetch(`/api/jobs?page=${page}&limit=${limit}`);
            if (res.ok) {
                const data = await res.json();
                setJobs(data.jobs || []);
                setTotal(data.total);
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        }
    };

    const handleViewLogs = async (job) => {
        setLoadingLogs(true);
        try {
            const res = await fetch(`/api/joblogs/${job.id}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedJob(data);
            } else {
                console.error("Failed to fetch detailed logs");
            }
        } catch (error) {
            console.error("Error fetching logs", error);
        } finally {
            setLoadingLogs(false);
        }
    };

    const closeModal = () => {
        setSelectedJob(null);
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="container jobs-container">
            <div className="glass-card">
                <h1 className="jobs-title">
                    Job History
                </h1>

                <div className="jobs-table-container">
                    <table className="jobs-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Logs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map(job => (
                                <tr key={job.id}>
                                    <td className="job-id">{job.id.substring(0, 8)}...</td>
                                    <td>{job.username}</td>
                                    <td>
                                        <span className={job.status === 'Running' ? 'status-running' : 'status-completed'}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td>{new Date(job.created_at).toLocaleDateString()}</td>
                                    <td className="log-cell">
                                        <button onClick={() => handleViewLogs(job)} className="view-logs-link">
                                            View Logs
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {jobs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="empty-state">No completed jobs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination-container">
                    <button
                        className={`btn-primary ${page === 1 ? 'btn-disabled' : ''}`}
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        Previous
                    </button>
                    <span className="pagination-text">Page {page} of {totalPages || 1}</span>
                    <button
                        className={`btn-primary ${page >= totalPages ? 'btn-disabled' : ''}`}
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modal */}
            {selectedJob && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Job {selectedJob.id.substring(0, 8)}...</h3>
                            <button className="btn-close" onClick={closeModal}>&times;</button>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ color: '#94a3b8', marginRight: '0.5rem' }}>Status:</span>
                            <span className={selectedJob.status === 'Running' ? 'status-running' : 'status-completed'}>
                                {selectedJob.status}
                            </span>
                        </div>
                        <div className="modal-logs">
                            {selectedJob.logs && selectedJob.logs.map((log, index) => (
                                <span key={index} className="log-line">
                                    <span style={{ color: '#555', marginRight: '0.5rem' }}>&gt;</span>
                                    {log}
                                </span>
                            ))}
                            {loadingLogs && <div style={{ textAlign: 'center', padding: '1rem' }}>Loading...</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Jobs;
