import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import './CustomToolbar.css'
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

    const handleZoomChange = (event) => {
        setZoom(event.target.value);
        // You'll likely need custom logic to update the calendar view based on zoom
    };

    return (
        <div className='customCalendarToolbar'>
            <div className="dateNavigation">    
                <button onClick={handleToday}>Today</button>
                <button onClick={handlePrev}>Previous</button>
                <button onClick={handleNext}>Next</button>
            </div>
            <div className="currentDate">
                {moment(currentDate).format('MMMM D, YYYY')}
            </div>
            <div className="zoomControl">
                Zoom: 
                <input
                    className="zoomControlBar"
                    type="range"
                    min="2"
                    max="14"
                    step="1"
                    value={zoom}
                    onChange={handleZoomChange}
                />
            </div>
        </div>
    );
};

export default CustomToolbar;
