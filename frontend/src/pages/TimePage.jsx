import { React, useContext, useState, useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar';

import { TokenContext } from '../App';
import AddButton from '../components/AddButton';
import EventCalendar from '../components/EventCalendar';
import LoadingPage from './LoadingPage';
import readTagsRequest from '../api/readTagsRequest';
import readEventsRequest from '../api/readEventsRequest';
import Stopwatch from '../components/Stopwatch';
import "../styles/TimePage.css"; // style sheet


export default function TimePage() {
    const [events, setEvents] = useState([]);
    const [tags, setTags] = useState([]);
    const [stopwatchIds, setStopwatchIds] = useState([1]);
    const [stopwatchesActive, setStopwatchesActive] = useState(0);

    // get token
    const { token } = useContext(TokenContext);
    const [tokenVal, setToken] = token;
    
    const [eventsQuery, tagsQuery] = useQueries({
        queries: [
            {
                // fetch events from DB and store to state variable
                queryKey: ['events'],
                queryFn: () => readEventsRequest(tokenVal)
                    .then((data) => {
                        setEvents(data); 
                        return data;
                    }),
            },
            {
                // fetch tags from DB and store to state variable
                queryKey: ['tags'],
                queryFn: () => readTagsRequest(tokenVal)
                    .then((data) => {
                        setTags(data); 
                        return data;
                    }),
            },
        ],
    });

    useEffect(() => {
        if (!eventsQuery.isLoading && !tagsQuery.isLoading) {
            setTimeout(() => {
                const h = new Date().getHours();
                const currTimeSlot = document.getElementsByClassName("rbc-timeslot-group")[h];
                currTimeSlot.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }, [eventsQuery.isLoading, tagsQuery.isLoading]);

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
        eventsQuery.isLoading && tagsQuery.isLoading
            ? <LoadingPage />
            : <div id="timePageContainer">
                <EventCalendar localizer={localizer} events={events} />
                <div id="timerContainer">
                    {stopwatchIds.map((id) => (
                        <Stopwatch
                            key={id}
                            tags={tags}
                            setTags={setTags}
                            itemId={id}
                            stopwatchIds={stopwatchIds}
                            setStopwatchIds={setStopwatchIds}
                            stopwatchesActive={stopwatchesActive}
                            setStopwatchesActive={setStopwatchesActive}
                        />
                    ))}
                    {stopwatchIds.length < 3 && <AddButton stopwatchIds={stopwatchIds} setStopwatchIds={setStopwatchIds} />}
                </div>
            </div>
    );
};