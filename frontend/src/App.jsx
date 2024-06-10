import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Toaster } from 'react-hot-toast'; // notifications

import authRequest from './api/authRequest';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import TimePage from './pages/TimePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LoadingPage from './pages/LoadingPage';
import './styles/App.css';

export const TokenContext = React.createContext(null);

function App() {
  const cookies = new Cookies(null, { path: '/' })
  const [token, setToken] = useState(cookies.get('token')); // try to get token from cookies
  const [auth, setAuth] = useState(undefined); // null means token has not been checked
  const [stopwatchsActives, setStopwatchesActive] = useState(0);

  useEffect(() => {
    if (token) {
      authRequest(token)
        .then(response => {
          if (response.status == 200) {
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

  // prevent users from reloading / closing page while stopwatch is running
  useEffect(() => {
    if (stopwatchsActives == 0) { // stopwatch not running, safe to unload
        return 
    }

    if (!auth) { // user logged out, update stopwatchesActive
      setStopwatchesActive(0)
      return
    }

    // // stopwatch running
    // const handleBeforeUnload = (event) => {
    //     event.preventDefault();
    //     return (event.returnValue = '');
    // }
    // window.addEventListener('beforeunload', handleBeforeUnload, { capture: true });
    // // cleanup function handles when component unmounts
    // return () => {
    //     window.removeEventListener('beforeunload', handleBeforeUnload, { capture: true });
    // };    
  }, [stopwatchsActives]);

  const RootPage = () => {
    const { auth } = useContext(TokenContext);
    const [authVal, _] = auth

    // set page to loading until authentication has been attempted
    return authVal == undefined
      ? <LoadingPage />
      : authVal
        ? <TimePage
          stopwatchesActive={stopwatchsActives}
          setStopwatchesActive={setStopwatchesActive}
        />
        : <LandingPage />;
  };

  return (
    <div className="App">
      <TokenContext.Provider value={{ token: [token, setToken], auth: [auth, setAuth] }}>
        <header>
          <NavBar />
        </header>
        <Toaster position="top-center" toastOptions={{ duration: 2000, style: { fontFamily: 'Arial, Helvetica, sans-serif', fontSize: "0.9rem" } }} />
        <Routes>
          <Route
            path="/"
            element={<RootPage />}
          />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </TokenContext.Provider>
    </div>
  )
}

export default App
