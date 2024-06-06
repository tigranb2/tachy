import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Cookies from 'universal-cookie';

import authRequest from './api/authRequest';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import TimePage from './pages/TimePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import './App.css';

export const TokenContext = React.createContext(null);

const RootPage = () => {
  const { auth }= useContext(TokenContext);
  const [authVal, _] = auth

  // set page to loading until authentication has been attempted
  return authVal == undefined ? <p>Loading...</p> 
    : authVal ? <TimePage /> : <LandingPage/>;
};

function App( ) {
  const cookies = new Cookies(null, { path: '/' })
  const [token, setToken] = useState(cookies.get('token')); // try to get token from cookies
  const [auth, setAuth] = useState(undefined); // null means token has not been checked

  useEffect(() => {
    if(token) {
      authRequest(token)
        .then(response => {
          if(response.status == 200) {
            setAuth(true) // set state to authenticated
            return
          } else { // failed auth; remove token in cookies
            cookies.remove('token')
            setToken(null)
            setAuth(false)
          }
        })
        .catch(error => { // request failed
          setAuth(false) 
        });
    } else { // no token exists
      setAuth(false) 
    }
  }, [])

  return (
    <div className="App">
      <TokenContext.Provider value={{token: [token, setToken], auth: [auth, setAuth]}}>
          <header>
            <NavBar />
          </header>
          <Routes>
            <Route
              path="/"
              element={<RootPage/>}
            />
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
          </Routes>
      </TokenContext.Provider>
    </div>
  )
}

export default App
