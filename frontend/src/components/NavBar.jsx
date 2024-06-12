import { useContext, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import { TokenContext } from '../App';
import logo from "../assets/tachy-logo.svg" // site logo 
import "../styles/NavBar.css" // stylesheet


function NavBar() {
    const [showMenu, setShowMenu] = useState(false);
    
    // get token and authentication state
    const { token, auth } = useContext(TokenContext);
    const [_, setToken] = token;
    const [authVal, setAuth] = auth;

    const navigate = useNavigate();
    const cookies = new Cookies(null, { path: '/' });
    const queryClient = useQueryClient();

    function toggleMenu(){
        setShowMenu(!showMenu);
    };

    // method to handle click on login button
    const loginClick = () => {
        navigate('/login')
    };
    // method to handle click on logout button
    const logoutClick = () => {
        setAuth(false)
        setToken(undefined)
        cookies.remove('token')
        queryClient.removeQueries('events')
        window.onbeforeunload = () => true
        navigate('/', { replace: true })
    };

    return (
        <div id="navbar">
            <div id="logo-container">
                <img id="logo" onClick={() => navigate('/', { replace: true })} src={logo}/>
            </div>
            {/* <div id="toggle-container">
                <a onClick={toggleMenu}><img id="toggle-icon" src={!showMenu ? <faBars> : xmark} /></a>
            </div> */}
            <ul onClick={() => setShowMenu(false)} className={showMenu ? "visible" : "hidden"}>         
                {/* <li><a className="nav-link" href="https://github.com/tigranb2/armenian-dish-classification" target="_blank">Source Code</a></li> */}
                <li>{authVal ? <button className="loginLogout" onClick={logoutClick}>Logout</button> : <button className="loginLogout" onClick={loginClick}>Login</button>}</li>
            </ul> 
        </div>
    );
};

export default NavBar;