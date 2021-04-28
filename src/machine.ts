import { Machine, assign } from "xstate";

const timerMachine = Machine(
  {
    id: "TimerMachine",
    type: "parallel",
    context: {
      seconds: new Date().getSeconds(),
      minutes: new Date().getMinutes(),
      hours: new Date().getHours(),
      day: new Date().getDay(),
      alarmHour: 3,
      alarmMins: 59,
      alarm: "off",
    },
    invoke: {
      id: "Timer",
      src: "timer",
    },
    states: {
      alarm: {
        initial: "alarmOff",
        states: {
          alarmOff: {
            on: {
              TICK: {
                cond: "checkIfTimeEqualsAlarmTime",
                target: "alarmOn",
                actions: "setAlarmOn",
              },
            }
          },
          alarmOn: {
            after: {
              10000: {
                target: "alarmOff",
                actions: "setAlarmOff"
              }
            },
            on: {
              STOP: {
                target: "alarmOff",
                actions: "setAlarmOff",
              }
            }
          }
        }
      },
      time: {
        initial: "idle",
        states: {
          idle: {
            on: {
              TICK: [
                {
                  cond: "checkIfSecondsEqualsSixty",
                  actions: ["setSecondsToZero", "incrementMinutes"],
                },
                {
                  cond: "checkIfMinutesEqualsSixty",
                  actions: ["setMinutesToZero", "incrementHours"],
                },
                {
                  cond: "checkIfHoursEqualsTwentyFour",
                  actions: [
                    "setMinutesToZero",
                    "setHoursToZero",
                    "setSecondsToZero",
                  ],
                },
                {
                  actions: ["incrementSeconds"],
                },
              ],
              RESET: {
                actions: [
                  "setSecondsToZero",
                  "setMinutesToZero",
                  "setHoursToZero",
                ],
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      incrementSeconds: assign({
        seconds: (context) => context.seconds + 1,
      }),
      incrementMinutes: assign({
        minutes: (context) => context.minutes + 1,
      }),
      incrementHours: assign({
        minutes: (context) => context.seconds + 1,
      }),
      setSecondsToZero: assign({ seconds: (context) => 0 }),
      setMinutesToZero: assign({ minutes: (context) => 0 }),
      setHoursToZero: assign({ hours: (context) => 0 }),
      setAlarmOn: assign({ alarm: (context) => "on" }),
      setAlarmOff: assign({ alarm: (context) => "off" }),
    },
    services: {
      timer: (context) => (send) => {
        setInterval(() => send("TICK"), 1000);
      },
    },
    guards: {
      checkIfSecondsEqualsSixty: (context) => context.seconds === 59,
      checkIfMinutesEqualsSixty: (context) => context.minutes === 59,
      checkIfHoursEqualsTwentyFour: (context) => context.hours === 23,
      checkIfTimeEqualsAlarmTime: (context) =>
        context.hours === context.alarmHour &&
        context.minutes === context.alarmMins
    },
  }
);

export default timerMachine;
