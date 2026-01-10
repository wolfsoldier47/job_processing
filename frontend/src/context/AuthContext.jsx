import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            const res = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                // Token is invalid or expired
                localStorage.removeItem('token');
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed", error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            const data = await res.json();
            // Store JWT token in localStorage
            localStorage.setItem('token', data.token);
            await checkAuthStatus();
            return true;
        }
        const err = await res.text();
        throw new Error(err || 'Login failed');
    };

    const register = async (username, password) => {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            return true;
        }
        const err = await res.text();
        throw new Error(err || 'Registration failed');
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
            localStorage.removeItem('token');
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
            // Remove token anyway
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
