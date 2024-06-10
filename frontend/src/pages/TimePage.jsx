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


export default function TimePage({ stopwatchesActive, setStopwatchesActive }) {
    const [events, setEvents] = useState();
    const [stopwatchIds, setStopwatchIds] = useState([1]);

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