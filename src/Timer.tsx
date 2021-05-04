import "./App.css";
import React, { useState } from "react";
import { useMachine } from "@xstate/react";
import alarmGIF from "./image/alarm.gif";
import timerMachine from "./machine";

function Timer() {
  // eslint-disable-next-line
  const [time, send] = useMachine(timerMachine);
  const [alarmTime, setAlarmTime] = useState("12:00");
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
      <h1 className="date">
        {time.context.month +
          1 +
          "/" +
          time.context.date +
          "/" +
          time.context.year}
      </h1>
      <div className="timeNow">
        {time.context.hours === 0 ? (
          <h1>12:</h1>
        ) : time.context.hours > 12 ? (
          <h1>{time.context.hours - 12}:</h1>
        ) : (
          <h1>{time.context.hours}:</h1>
        )}
        <h1>{time.context.minutes}:</h1>
        <h1>{time.context.seconds}</h1>
      </div>
      <div className="buttonsDiv">
        <button onClick={() => send("TICK")}>Increment</button>
        <button onClick={() => send("RESET")}>Reset</button>
      </div>
      <div className="alarm">
        {time.context.alarm === "on" ? (
          <div>
            <img className="alarmClock" alt="Alarm" src={alarmGIF}></img>
            <button className="stopBtn" onClick={() => send("STOP")}>
              Stop
            </button>
          </div>
        ) : (
          <div className="setAlarm">
            <h1>Set Alarm</h1>
            <input
              className="inputTime"
              type="time"
              onChange={(e) => setAlarmTime(e.target.value)}
            ></input>
            <button
              onClick={() =>
                send({
                  type: "SET_ALARM",
                  payload: alarmTime,
                })
              }
            >
              Set
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Timer;
