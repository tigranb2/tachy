import { useNavigate } from 'react-router-dom';
import "../styles/LandingPage.css"; // style sheet

export default function LandingPage() {
    const navigate = useNavigate();
    return (
        <div id="landingBackground">
            <div id="landingContainer">
                <h1 id="landingHeader">Improve your productivity and time management.</h1>
                <p className="landingText">Track your work habits to identify areas of improvement and optimize scheduling. Accessible anywhere, anytime.</p>
                <div id="landingButtonContainer">
                    <button className="landingButton" onClick={() => navigate('/register')}>REGISTER</button>
                    <button className="landingButton"><a className="link" href="https://youtu.be/BVec2r6w4GM" target="_blank">VIDEO DEMO</a></button>
                </div>
            </div>
        </div>
    )
}