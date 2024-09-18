import { useContext, useEffect } from "react";
import { AuthContext } from "./context/authContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { replace: true });
        }
    }, [currentUser, navigate]);  
    
    return currentUser ? children : null;
}

export default ProtectedRoute;
