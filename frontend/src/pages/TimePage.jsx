import { React, useContext, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar';

import { TokenContext } from '../App';
import AddButton from '../components/AddButton';
import EventCalendar from '../components/EventCalendar';
import LoadingPage from './LoadingPage';
import readEventsRequest from '../api/readEventsRequest';
import Stopwatch from '../components/Stopwatch';
import "../styles/TimePage.css"; // style sheet


export default function TimePage() {
    const [events, setEvents] = useState();
    const [stopwatchIds, setStopwatchIds] = useState([1]);
    const [stopwatchesActive, setStopwatchesActive] = useState(0);

    // get token
    const { token } = useContext(TokenContext);
    const [tokenVal, setToken] = token; 

    // fetch events from DB and store to state variable
    const { isLoading, data: _,  isPreviousData } = useQuery(
        'events', 
        () => readEventsRequest(tokenVal),
        {
            onSuccess: (data) => {setEvents(data);}
        }
    );

    useEffect(() => {
        if (!isLoading) {
            setTimeout(() => {
                const h = new Date().getHours();
                const currTimeSlot = document.getElementsByClassName("rbc-timeslot-group")[h];
                currTimeSlot.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }, [isLoading]);

    // prevent users from reloading / closing page while stopwatch is running
    useEffect(() => {
        if (stopwatchesActive == 0) { // stopwatch not running, safe to unload
            return 
        }

        // stopwatch running
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            return (event.returnValue = '');
        }
        window.addEventListener('beforeunload', handleBeforeUnload, { capture: true });
        // cleanup function handles when component unmounts
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload, { capture: true });
            setStopwatchesActive(0)
        };    
    }, [stopwatchesActive]);

    const localizer = momentLocalizer(moment)
    return (
        isLoading
            ? <LoadingPage />
            : <div id="timePageContainer">
                <EventCalendar localizer={localizer} events={events} />
                <div id="timerContainer">
                    {stopwatchIds.map((id) => (
                        <Stopwatch 
                            key={id}
                            itemId={id} 
                            stopwatchIds={stopwatchIds} 
                            setStopwatchIds={setStopwatchIds}
                            stopwatchesActive={stopwatchesActive}
                            setStopwatchesActive={setStopwatchesActive}
                        />
                    ))}
                    {stopwatchIds.length < 3 && <AddButton stopwatchIds={stopwatchIds} setStopwatchIds={setStopwatchIds}/>}
                </div>
            </div>
    );
};