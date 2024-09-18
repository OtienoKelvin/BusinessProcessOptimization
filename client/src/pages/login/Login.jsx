import React, { useContext, useState } from 'react';
import "./login.scss";
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';



const Login = () => {

  const navigate = useNavigate();
  const {login, error, loading} = useContext(AuthContext);
  const [formValues, setFormValues] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.username) newErrors.username = "Username is required";
    if (!formValues.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await login(formValues);
    navigate('/dashboard', {replace: true});
    

    console.log("Login successful");
  };

  return (
    <div className='login'>
      <div className="card">
        <div className="left">
          <h1>OPTIMIZE YOUR BUSINESS</h1>
          <p>We are here to make your business run more efficiently and smoothly through our services.</p>
          <span>Don't have an account?</span>
          <button onClick={() => window.location.href = "/register"}>Register</button>
        </div>
        <div className="right">
          <h1>LOGIN</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" value={formValues.username} onChange={handleInputChange} />
              {errors.username && <span className="error">{errors.username}</span>}
            </div>
            <div className="input-field">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" value={formValues.password} onChange={handleInputChange} />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <button type="submit" disabled={loading}>{loading ? "Loading..." : "LOGIN"}</button>
            {error && <span className="error">{error}</span>}
          </form>
        </div>
      </div>  
    </div>
  );
};

export default Login;

