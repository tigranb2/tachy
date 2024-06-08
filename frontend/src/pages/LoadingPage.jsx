import logo from "../assets/tachy-logo.svg" // site logo 
import "../styles/LoadingPage.css"; // style sheet

export default function LoadingPage() {
    return (
        <div id="loading">
            <img src={logo} width={200} />
            <div id="loading-text">
              <p>Loading model</p>
              <div id="ellipsis"></div>
            </div>
        </div>
    )
} 