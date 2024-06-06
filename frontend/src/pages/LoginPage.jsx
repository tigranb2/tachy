import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import loginRequest from '../api/loginRequest';
import { TokenContext } from '../App';
import "./Login.css"; // style sheet

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
            .then((response) => {
                if(response.status == 200) { // login succeeded
                    setToken(cookies.get("token"))
                    setAuth(true)
                    navigate("/", { replace: true })
                } else { // invalid login
                    setFormData({
                        email: '',
                        password: '',
                    })
                    console.log(response.json)
                }
            })
            .catch((err) => { // request failed
                console.log(err)
            })
      };
    
    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            <button type="submit">Login</button>
        </form>
    );
}