import React, { useState, useEffect, Fragment } from "react";

import createEvents from '../api/createEvents';
import "./Stopwatch.css";

export default function Stopwatch ({ events,  setEvents }) {
  const [time, setTime] = useState(0); // stores stopwatch time
  const [startTime, setStartTime] = useState(0); // start time at epoch

  // tracks whether stopwatch is running
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      // update timer every ~10 milliseconds
      intervalId = setInterval(() => {
        let prevTime = startTime + (time * 10)
        let dt = Date.now() - prevTime; // milliseconds elapsed since last iteration
        setTime(time + Math.floor(dt/10)) // divide by 10... doesn't have ms percision
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const hours = Math.floor(time / 360000);
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  // Method to pause & unpause timer
  const pauseUnpause = () => {
    setIsRunning(!isRunning);
  };

   // Method to start timer
   const start = () => {
    setStartTime(Date.now()); // save time since epoch from timer start
    pauseUnpause();
  };

  // Method to create event with timer time
  const save = () => {
    const startDate = new Date(0);
    const endDate = new Date(0);
    startDate.setUTCMilliseconds(startTime)
    endDate.setUTCMilliseconds(startTime+(time*10))
    
    // reset timer
    setStartTime(0);
    setTime(0);
    setIsRunning(false);

    // create event and upload to database
    const newEvent = {
      tag: "",
      startTime: startDate,
      endTime: endDate,
    }
    createEvents(newEvent);
    setEvents([...events, newEvent]); // add events to local data
  };

  // Method to set timer back to 0
  const reset = () => {
    setTime(0);
    setIsRunning(false);
  };

  return (
    <div className="stopwatchContainer">
      <p className="stopwatchTime">
        {hours.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}.
        {milliseconds.toString().padStart(2, "0")}
      </p>
      <div className="stopwatchButtons">
        {
          time == 0 
            ? <button className="stopwatchButton left" onClick={start}>
                START
              </button>
            : <button className="stopwatchButton left" onClick={pauseUnpause}>
              {
              isRunning
                ? "PAUSE"
                : "RESUME"
              }
            </button>
        }
        {
          time == 0
            ? <button className="stopwatchButton right" disabled onClick={save}>
              SAVE
            </button>
            : <Fragment><button className="stopwatchButton middle" onClick={reset}>
              RESET
            </button>
              <button className="stopwatchButton right" onClick={save}>
                SAVE
              </button>
            </Fragment>
        }
      </div>
    </div>
  );
};