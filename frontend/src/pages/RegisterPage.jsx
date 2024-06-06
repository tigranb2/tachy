import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import registerRequest from '../api/registerRequest';
import { TokenContext } from '../App';
import "./Register.css"; // style sheet

export default function RegisterPage() {
    const { auth } = useContext(TokenContext);
    const [authVal, setAuth] = auth

    const navigate = useNavigate();
    if (authVal) { // avoid register page if already authenticated
        navigate('/', { replace: true })
    }
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
      });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        registerRequest(formData)
            .then(() => navigate('/login'));
      };
    
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} pattern="^[A-Za-z \s*]+$" required/>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required/>
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required/>
            <button type="submit">Register</button>
        </form>
    );
}