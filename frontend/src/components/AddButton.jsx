import "../styles/AddButton.css";

export default function AddButton({ stopwatchIds, setStopwatchIds }) {
    return (
        <button className="mainContainer addButton"
                onClick={()=>setStopwatchIds([...stopwatchIds, stopwatchIds.length+1])}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"><circle cx="128" cy="128" r="112"/><path d="M 79.999992,128 H 176.0001"/><path d="m 128.00004,79.99995 v 96.0001"/></g></svg>
        </button>
    )
}