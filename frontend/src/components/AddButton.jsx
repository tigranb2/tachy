export default function AddButton({ stopwatchIds, setStopwatchIds}) {
    return (
        <button className='addButton'
                onClick={()=>setStopwatchIds([...stopwatchIds, stopwatchIds.length+1])}>
        </button>
    )
}