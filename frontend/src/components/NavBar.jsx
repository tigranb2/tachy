import { useState } from 'react'

import "./NavBar.css" // stylesheet


function NavBar() {
    const [showMenu, setShowMenu] = useState(false);

    function toggleMenu(){
        setShowMenu(!showMenu);
    };

    return (
        <div id="navbar">
            <div id="logo-container">
                <p> logo </p>
            </div>
            {/* <div id="toggle-container">
                <a onClick={toggleMenu}><img id="toggle-icon" src={!showMenu ? <faBars> : xmark} /></a>
            </div> */}
            <ul onClick={() => setShowMenu(false)} className={showMenu ? "visible" : "hidden"}>
                <li><a className="nav-link" href="#How_it_works">How It Works</a></li>          
                <li><a className="nav-link" href="https://github.com/tigranb2/armenian-dish-classification" target="_blank">Source Code</a></li>
            </ul> 
   
        </div>
    );
};

export default NavBar;