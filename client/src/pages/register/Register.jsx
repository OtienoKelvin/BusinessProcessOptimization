import React, { useState } from 'react';
import "./register.scss";
import makeRequest from '../../axios';
import { useNavigate } from 'react-router-dom'




const Register = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
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
    if (!formValues.firstName) newErrors.firstName = "First name is required";
    if (!formValues.lastName) newErrors.lastName = "Last name is required";
    if (!formValues.username) newErrors.username = "Username is required";
    if (!formValues.email || !/\S+@\S+\.\S+/.test(formValues.email)) newErrors.email = "Valid email is required";
    if (!formValues.password || formValues.password.length < 6) newErrors.password = "Password must be at least 6 characters long";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await makeRequest.post('/auth/register', formValues);
      console.log("User registered successfully", response?.data);

      navigate('/login', {replace: true});

    } catch (error) {
      console.error("Error during registration:", error);
      setError( error.response?.data);
    } finally {
      setLoading(false);
    }
    

    // Proceed with API call or form submission
    console.log("Form submitted", formValues);
  };

  return (
    <div className='register'>
      <div className="card">
        <div className="left">
          <h1>OPTIMIZE YOUR BUSINESS</h1>
          <p>We are here to make your business run more efficiently and smoothly through our services.</p>
          <span>Do you have an account?</span>
          <button onClick={() => window.location.href = "/login"}>Login</button>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            {['firstName', 'lastName', 'username', 'email', 'password'].map(field => (
              <div className="input-field" key={field}>
                <label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input 
                  type={field === 'password' ? 'password' : 'text'} 
                  id={field} 
                  value={formValues[field]} 
                  onChange={handleInputChange} 
                />
                {errors[field] && <span className="error">{errors[field]}</span>}
              </div>
            ))}
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'CREATE ACCOUNT'}
            </button>
            {error && <span className="error">{error}</span>}
          </form>
        </div>
      </div>      
    </div>
  );
};

export default Register;

