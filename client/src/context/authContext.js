import { createContext, useEffect, useState } from "react";
import makeRequest from "../axios";
//import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    //const navigate = useNavigate();

    // Helper function to refresh the token
    const refreshAccessToken = async () => {
        try {
            const response = await makeRequest.post('/auth/refresh', {}, {
                withCredentials: true 
            });
            const newAccessToken = response.data.access_token;
            setCurrentUser((prevUser) => ({
                ...prevUser,
                access_token: newAccessToken,
            }));
            localStorage.setItem('user', JSON.stringify({
                ...currentUser,
                access_token: newAccessToken,
            }));
            return newAccessToken;
        } catch (err) {
            console.error("Error refreshing token:", err);
            logout(); 
        }
    };

    // Login function
    const login = async (formValues) => {
        try {
            setLoading(true);
            const response = await makeRequest.post('/auth/login', formValues, {
                withCredentials: true
            });
            setCurrentUser(response.data);
            setError(null);
            //navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await makeRequest.post('/auth/logout', {}, {
                withCredentials: true
            });
            setCurrentUser(null);
            localStorage.removeItem('user');
            //navigate('/login');
        } catch (err) {
            console.error("Error logging out:", err);
        }
    };

    // Automatically save user to localStorage when currentUser changes
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('user');
        }
    }, [currentUser]);

    // Check session and refresh token on page load
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await makeRequest.get('/auth/check-session', {
                    withCredentials: true
                });
                setCurrentUser(response.data);
            } catch (err) {
                console.error("Session expired or user not authenticated.");
                logout();
            }
        };

        checkSession();
    },[] );

    
    useEffect(() => {
        const interval = setInterval(() => {
            if (currentUser && currentUser.access_token) {
                
                refreshAccessToken();
            }
        }, 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, error, refreshAccessToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider };
