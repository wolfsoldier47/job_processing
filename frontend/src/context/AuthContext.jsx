import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // Decode JWT token (payload is the middle part)
            const payload = JSON.parse(atob(token.split('.')[1]));

            // Check if token is expired
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                localStorage.removeItem('token');
                setUser(null);
            } else {
                // Set user from token payload
                setUser({ username: payload.username });
            }
        } catch (error) {
            console.error("Invalid token", error);
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
            localStorage.setItem('token', data.token);

            // Decode token to get user info
            try {
                const payload = JSON.parse(atob(data.token.split('.')[1]));
                setUser({ username: payload.username });
            } catch (error) {
                console.error("Failed to decode token", error);
            }

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

    const logout = () => {
        // JWT is stateless - just remove token and clear user
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
