import { React, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar';

import AddButton from '../components/AddButton';
import EventCalendar from '../components/EventCalendar';
import Stopwatch from '../components/Stopwatch';
import "./TimePage.css"; // style sheet
import readEventsRequest from '../api/readEventsRequest';


export default function TimePage() {

    const [events, setEvents] = useState();
    const [stopwatchIds, setStopwatchIds] = useState([1]);

    // fetch events from DB and store to state variable
    const { isLoading, data: _ } = useQuery(
        'events', 
        () => readEventsRequest(),
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
            ? <div id="timePageContainer">
                <div>loading...</div>
            </div>
            : <div id="timePageContainer">
                <EventCalendar localizer={localizer} events={events} />
                <div id="timerContainer">
                    {stopwatchIds.map((id) => (
                        <Stopwatch 
                            key={id}
                            itemId={id} 
                            stopwatchIds={stopwatchIds} 
                            setStopwatchIds={setStopwatchIds}
                        />
                    ))}
                    {stopwatchIds.length < 3 && <AddButton stopwatchIds={stopwatchIds} setStopwatchIds={setStopwatchIds}/>}
                </div>
            </div>
    );
};