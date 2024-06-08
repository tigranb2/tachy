import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import registerRequest from '../api/registerRequest';
import { TokenContext } from '../App';
import "../styles/LoginRegister.css"; // style sheet

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
            .then((resp) => {
                if (resp.error) {
                    setFormData({
                        name: formData.name,
                        email: formData.email,
                        password: '',
                    })
                    toast.error(resp.error)
                } else {
                    toast.success("Registration successful")
                    navigate('/login')
                }
            });
    };

    return (
        <div className='formContainer'>
            <form className="loginLogoutForm" onSubmit={handleSubmit}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        const requiredFields = ['name', 'email', 'password'];
                        const isFormValid = requiredFields.every( // ensure fields are not empty
                            field => formData[field] && formData[field].trim() !== ''
                        );

                        // only submit non-empty form
                        if (isFormValid) {
                            handleSubmit(e)
                        }
                    };
                }}>
                <h2 className='formHeader'>Register</h2>
                <div className="formGroup">
                    <input required type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} pattern="^[A-Za-z \s*]+$" />
                </div>
                <div className="formGroup">
                    <input required type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="formGroup">
                    <input required type="password" name="password" placeholder="Password (8 to 24 characters)" value={formData.password} onChange={handleChange} />
                </div>
                <div className="formGroup">
                    <button className="formRedirect" onClick={() => navigate('/login')}>Login to existing account</button>
                </div>
                <button className="formSubmit" type="submit">Register</button>
            </form>
        </div>
    );
}