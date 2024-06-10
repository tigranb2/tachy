import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { toast } from 'react-hot-toast'

import loginRequest from '../api/loginRequest';
import { TokenContext } from '../App';
import "../styles/LoginRegister.css"; // style sheet

export default function LoginPage() {
    const { token, auth } = useContext(TokenContext);
    const [tokenVal, setToken] = token
    const [authVal, setAuth] = auth

    const navigate = useNavigate();
    if (authVal) { // avoid login page if already authenticated
        navigate('/', { replace: true })
    }

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const cookies = new Cookies(null, { path: '/' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        loginRequest(formData)
            .then((resp) => {
                if (resp.error) {
                    setFormData({
                        email: '',
                        password: '',
                    })
                    toast.error(resp.error)
                } else { // login succeeded
                    // set cookie with 1 week expiration
                    cookies.set(token, resp.token, { maxAge: 604800000 });
                    setToken(cookies.get("token"))
                    setAuth(true)
                    toast.success("Login successful")
                    navigate("/", { replace: true })
                }
            })
    };

    return (
        <div className='formContainer'>
            <form className="loginLogoutForm" onSubmit={handleSubmit}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        const requiredFields = ['email', 'password'];
                        const isFormValid = requiredFields.every( // ensure fields are not empty
                            field => formData[field] && formData[field].trim() !== ''
                        );

                        // only submit non-empty form
                        if (isFormValid) {
                            handleSubmit(e)
                        }
                    };
                }}>
                <h2 className='formHeader'>Login</h2>
                <div className="formGroup">
                    <input required type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="formGroup">
                    <input required type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                </div>
                <div className="formGroup">
                    <button className="formRedirect" onClick={() => navigate('/register')}>Register account</button>
                </div>
                <button className="formSubmit" type="submit">Login</button>
            </form>
        </div>
    );
}