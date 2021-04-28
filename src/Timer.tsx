import "./App.css";
import { useMachine } from "@xstate/react";
import alarmGIF from "./image/alarm.gif";
import timerMachine from "./machine";

function Timer() {
  // eslint-disable-next-line
  const [time, send] = useMachine(timerMachine);

  return (
    <div className="divTimer">
      <h1>TIME:</h1>
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
          <img className="alarmClock" alt="Alarm" src={alarmGIF}></img>
        ) : (
          <div className="setAlarm">
            <h1>Set Alarm</h1>
            
          </div>
        )}
      </div>
    </div>
  );
}

export default Timer;
