import "./App.css";
import React, { useState } from "react";
import { useMachine } from "@xstate/react";
import TimePicker from "react-time-picker";
import alarmGIF from "./image/alarm.gif";
import timerMachine from "./machine";

function Timer() {
  // eslint-disable-next-line
  const [time, send] = useMachine(timerMachine);
  const [value, onChange] = useState("10:00");
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="divTimer">
      <h1 className="day">{days[time.context.day - 1]}</h1>
      <div className="timeNow">
        <h1>{time.context.hours}:</h1>
        <h1>{time.context.minutes}:</h1>
        <h1>{time.context.seconds}</h1>
      </div>
      <div className="buttonsDiv">
        <button onClick={() => send("TICK")}>Increment</button>
        <button onClick={() => send("RESET")}>Reset</button>
      </div>
      <div>
        {time.context.alarm === "on" ? (
          <div>
            <img className="alarmClock" alt="Alarm" src={alarmGIF}></img>
            <button onClick={() => send("STOP")}>Stop</button>
          </div>
        ) : (
          <div className="setAlarm">
            <h1>Set Alarm</h1>
            {/* <TimePicker onChange={onChange} value={value} /> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Timer;
