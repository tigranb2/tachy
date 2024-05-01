import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, { useCallback, useEffect, useState, useMemo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Calendar, Views, DateLocalizer } from 'react-big-calendar'

import "./EventCalendar.css";

export default function EventCalendar({
  localizer,
  events,
  dayLayoutAlgorithm = 'no-overlap',
}) {
  const [myEvents, setMyEvents] = useState();

  useEffect(() => {
    setMyEvents(events.map(x => (
      {
        id: 0,
        title: x.title,
        allDay: false,
        start: new Date(x.startTime),
        end: new Date(x.endTime),
      }
    ))
  )}, [events]);


  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
  )

  // const { defaultDate, scrollToTime } = useMemo(
  //   () => ({
  //     defaultDate: new Date(2015, 3, 12),
  //     scrollToTime: new Date(1970, 1, 1, 8),
  //   }),
  //   []
  // )

  return (
    <Fragment>
      <div id="calendarContainer">
        <Calendar
          dayLayoutAlgorithm={dayLayoutAlgorithm}
          defaultView={Views.DAY}
          events={myEvents}
          localizer={localizer}
          onSelectEvent={handleSelectEvent}
          // onSelectSlot={handleSelectSlot}
          onSelecting={_ => false}
          selectable
          // scrollToTime={scrollToTime}
          //step={20}
          // timeslots={3}
          views={['day']}
          formats={{ timeGutterFormat: 'hA' }}
        />
      </div>
    </Fragment>
  )
}

EventCalendar.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
  events: PropTypes.array,
  dayLayoutAlgorithm: PropTypes.string,
}