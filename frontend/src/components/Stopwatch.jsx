import React, { useContext, useState, useEffect, Fragment } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TokenContext } from '../App';
import createEventRequest from '../api/createEventRequest';
import "../styles/Stopwatch.css";
import TagDropdown from "./TagDropdown";

export default function Stopwatch({ itemId,
                                    tags,
                                    setTags,
                                    stopwatchIds,
                                    setStopwatchIds,
                                    stopwatchesActive,
                                    setStopwatchesActive, }) {
  const [title, setTitle] = useState(""); // stores stopwatch title
  const [selectedTag, setSelectedTag] = useState(null); // stores stopwatch tag
  const [time, setTime] = useState(0); // stores stopwatch time
  const [startTime, setStartTime] = useState(0); // start time at epoch

  // get token
  const { token } = useContext(TokenContext);
  const [tokenVal, setToken] = token;

  const queryClient = useQueryClient(); // for invalidating queries

  // tracks whether stopwatch is running
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      // update timer every ~10 milliseconds
      intervalId = setInterval(() => {
        let prevTime = startTime + (time * 10)
        let dt = Date.now() - prevTime; // milliseconds elapsed since last iteration
        setTime(time + Math.floor(dt / 10)) // divide by 10... doesn't have ms percision
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
    setStopwatchesActive(stopwatchesActive + 1);
    pauseUnpause();
  };

  // Method to set timer back to 0
  const reset = () => {
    setTime(0);
    setStopwatchesActive(stopwatchesActive - 1);
    setIsRunning(false);
  };


  // API call to create event given timer start and end times
  // invalidates local cache after compeletion
  const createEvent = useMutation({
    mutationFn: () => {
      const startDate = new Date(0);
      const endDate = new Date(0);
      startDate.setUTCMilliseconds(startTime)
      endDate.setUTCMilliseconds(startTime + (time * 10))

      // reset timer
      reset()

      // create event and upload to database
      const newEvent = {
        tag: "",
        title: title,
        tag: selectedTag.name,
        color: selectedTag.color,
        startTime: startDate,
        endTime: endDate,
      }
      return createEventRequest(newEvent, tokenVal);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['events']});
    },
  });

  // allow user to set name for stopwatch
  const handleUserInput = (event) => {
    setTitle(event.target.value);
  };

  // calculate width of user input title
  const getTitleWidth = () => {
    const text = document.createElement("span");
    document.body.appendChild(text)
    text.innerHTML = title;
    text.style.position = 'absolute';
    text.style.whiteSpace = 'no-wrap';
    text.style.height = 'auto';
    text.style.width = 'auto';
    const titleWidth = text.clientWidth
    document.body.removeChild(text)
    return titleWidth
  }

  return (
    <div className="mainContainer stopwatchContainer">
      <div className="stopwatchTop">
        <div className="stopwatchIdentifiers">
          <TagDropdown 
            tags={tags}
            setTags={setTags}
            selectedTag={selectedTag} 
            setSelectedTag={setSelectedTag} 
          />
          <input id={"stopwatchTitle" + itemId}
            style={{ width: title.length ? Math.min(getTitleWidth() + 8, 256) + "px" : "" }} // dynamically set width
            className="stopwatchTitle"
            type="text"
            value={title}
            placeholder="Enter event title..."
            onChange={handleUserInput} />
        </div>
        {itemId != 1 && <button className="closeButton removeStopwatch" onClick={() => setStopwatchIds(stopwatchIds.slice(0, -1))}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M5.47 5.47a.75.75 0 0 1 1.06 0l12 12a.75.75 0 1 1-1.06 1.06l-12-12a.75.75 0 0 1 0-1.06" /><path d="M18.53 5.47a.75.75 0 0 1 0 1.06l-12 12a.75.75 0 0 1-1.06-1.06l12-12a.75.75 0 0 1 1.06 0" /></g> </svg>
        </button>}
      </div>
      <p className="stopwatchTime">
        {hours > 0 ? hours.toString().padStart(2, "0") + ":" : ""}
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
            : <button className="stopwatchButton left" onClick={reset}>
              RESET
            </button>
        }
        <button className="stopwatchButton right" disabled={time == 0 ? true : false} onClick={() => createEvent.mutate()}>
          SAVE
        </button>

        {
          // deprecated pause logic
        }
        {/* {
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
        } */}
        {/* {
          time == 0
            ? <button className="stopwatchButton right" disabled onClick={createEvent}>
              SAVE
            </button>
            : <Fragment><button className="stopwatchButton middle" onClick={reset}>
              RESET
            </button>
              <button className="stopwatchButton right" onClick={createEvent}>
                SAVE
              </button>
            </Fragment>
        } */}
      </div>
    </div>
  );
};