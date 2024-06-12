import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, { useContext, useEffect, useState, Fragment } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query';
import PropTypes from 'prop-types'
import { Calendar, Views, DateLocalizer } from 'react-big-calendar'
import Modal from 'react-modal';
import moment from 'moment';

import { TokenContext } from '../App';
import CustomToolbar from './CustomToolbar';
import deleteEventRequest from '../api/deleteEventRequest';
import "../styles/EventCalendar.css";

export default function EventCalendar({
  localizer,
  events,
}) {
  const [myEvents, setMyEvents] = useState();
  const [selectedEvent, setSelectedEvent] = useState(null)

  // get token
  const { token } = useContext(TokenContext);
  const [tokenVal, setToken] = token;

  useEffect(() => {
    setMyEvents(events.map(x => (
      {
        id: x._id,
        title: x.title,
        allDay: false,
        start: new Date(x.startTime),
        end: new Date(x.endTime),
        color: x.color
      }
    ))
    )
  }, [events]);

  const queryClient = useQueryClient();

  // call API to delete event & invalidate local cache
  const deleteEvent = useMutation({
    mutationFn: () => deleteEventRequest(selectedEvent, tokenVal),
    onSettled: () => {
      setSelectedEvent(null);
      queryClient.invalidateQueries({queryKey: ['events']});
    },
  });

  const handleSelectEvent = (event) => (
    setSelectedEvent(event)
  )

  const modalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 100,
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      fontFamily: "Arial",
      backgroundColor: '#28292a',
      color: '#e8e8e8',
      borderColor: "#565656"
    },
  };

  return (
    <Fragment>
      <div id="calendarContainer">
        {selectedEvent && <Modal
          isOpen={selectedEvent != null}
          onRequestClose={() => setSelectedEvent(null)}
          style={modalStyles}>
          <div className="popupHeader">
            <h3 className="popupTitle">{selectedEvent.title ? selectedEvent.title : "Untitled"}</h3>
            <button className="closeButton closePopup" onClick={() => setSelectedEvent(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M5.47 5.47a.75.75 0 0 1 1.06 0l12 12a.75.75 0 1 1-1.06 1.06l-12-12a.75.75 0 0 1 0-1.06" /><path d="M18.53 5.47a.75.75 0 0 1 0 1.06l-12 12a.75.75 0 0 1-1.06-1.06l12-12a.75.75 0 0 1 1.06 0" /></g> </svg>
            </button>
          </div>
          <p className="popupTimes">
            {moment(selectedEvent.start).format("MMMM DD, YYYY, hh:mm A")} – {moment(selectedEvent.end).format("MMMM DD, YYYY, hh:mm A")}
          </p>
          <div className="deleteEventContainer">
            <button className="deleteEventButton" onClick={deleteEvent.mutate}>
              DELETE
            </button>
          </div>
        </Modal>}
        <Calendar
          components={{
            toolbar: CustomToolbar,
            day: {
              event: (props) =>
                <div>
                  {props.title}
                  <p className='eventTag'>{props.tag ? props.tag : ""}</p>
                </div>,
            },
          }}
          dayLayoutAlgorithm='no-overlap'
          defaultView={Views.DAY}
          events={myEvents}
          localizer={localizer}
          onSelectEvent={(e) => handleSelectEvent(e)}
          onSelecting={_ => false}
          selectable
          views={['day']}
          formats={{ timeGutterFormat: 'hA' }}
          eventPropGetter={(events) => {
            const backgroundColor = events.color ? events.color : '#3163E0';
            return { style: { backgroundColor } }
          }}
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