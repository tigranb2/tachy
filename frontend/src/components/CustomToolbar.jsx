import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import '../styles/CustomToolbar.css'
const CustomToolbar = (props) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [zoom, setZoom] = useState(7); // initial zoom level

    const findFirstTimeslotInView = () => {
        const timeslotGroups = document.querySelectorAll('.rbc-timeslot-group');
        return Array.prototype.find.call(
            timeslotGroups,
            timeslot => timeslot.getBoundingClientRect().y > 50
        )
    }

    useEffect(() => {
        const scrollTo = findFirstTimeslotInView();
        const timeslots = document.querySelectorAll('.rbc-time-slot');
        const height = 3 * zoom
        timeslots.forEach(slot => {
          slot.style.minHeight = `${height}vh`; // Apply zoom to time-slots
        });
        scrollTo.scrollIntoView();
      }, [zoom]);
    
    const handlePrev = () => {
        setCurrentDate(moment(currentDate).subtract(1, 'day').toDate());
        props.onNavigate(Navigate.PREVIOUS);
    };

    const handleToday = () => {
        setCurrentDate(new Date());
        props.onNavigate(Navigate.TODAY);
    };

    const handleNext = () => {
        setCurrentDate(moment(currentDate).add(1, 'day').toDate());
        props.onNavigate(Navigate.NEXT);
    };


    // zoom in the calendar
    const handleZoomIn = () => {
        setZoom(zoom + 1);
    };

    // zoom out the calendar
    const handleZoomOut = () => {
        setZoom(zoom - 1);
    };


    return (
        <div className='customCalendarToolbar'>
            <div className="toolbarContainer">    
                <button id="navToday" onClick={handleToday}>Today</button>
                <button id="navPrev" onClick={handlePrev}>❯</button>
                <button id="navNext" onClick={handleNext}>❯</button>
            </div>
            <div className="currentDate">
                {moment(currentDate).format('MMMM D, YYYY')}
            </div>
            <div className="toolbarContainer"> 
                <button 
                    disabled={zoom == 2 ? true : false}
                    onClick={zoom == 2 ? {} : handleZoomOut}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.3rem" height="1.3rem" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 10h6m2 5l6 6m-11-4a7 7 0 1 1 0-14a7 7 0 0 1 0 14" />
                    </svg>
                </button>
                <button 
                    disabled={zoom == 14 ? true : false}
                    onClick={zoom == 14 ? {} : handleZoomIn}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.3rem" height="1.3rem" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 10h3m0 0h3m-3 0V7m0 3v3m5 2l6 6m-11-4a7 7 0 1 1 0-14a7 7 0 0 1 0 14" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CustomToolbar;
