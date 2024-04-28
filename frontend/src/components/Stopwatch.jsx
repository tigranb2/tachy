import React, { useState, useEffect, Fragment } from "react";

import createEvents from '../api/createEvents';
import "./Stopwatch.css";

const Stopwatch = () => {
  // state to store time
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(0); // start time in epoch

  // state to check stopwatch running or not
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  // Hours calculation
  const hours = Math.floor(time / 360000);

  // Minutes calculation
  const minutes = Math.floor((time % 360000) / 6000);

  // Seconds calculation
  const seconds = Math.floor((time % 6000) / 100);

  // Milliseconds calculation
  const milliseconds = time % 100;

  // Method to pause and unpause timer
  const pauseUnpause = () => {
    setIsRunning(!isRunning);
  };

   // Method to start timer
   const start = () => {
    setStartTime(Date.now()); // save time since epoch from timer start
    pauseUnpause();
  };

  // Method to reset timer back to 0
  const save = () => {
    const startDate = new Date(0);
    const endDate = new Date(0);
    startDate.setUTCMilliseconds(startTime)
    endDate.setUTCMilliseconds(startTime+time*10)
    
    setStartTime(0);
    setTime(0);
    setIsRunning(false);
    createEvents({
      tag: "",
      startTime: startDate,
      endTime: endDate,
    });

  };

  // Method to reset timer back to 0
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

export default Stopwatch;