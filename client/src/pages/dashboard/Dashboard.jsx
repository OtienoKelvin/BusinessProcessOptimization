import React, { useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const {logout} = useContext(AuthContext);
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/login', {replace: true});
  }
  return (
    <div>
      Dashboard
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard
