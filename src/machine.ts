import { Machine, assign, MachineConfig, AnyStateNodeDefinition  } from "xstate";

type TEvent = {
  type: string,
  payload: string
}

type TContext = {
  year: number,
  month: number;
  date: number,
  seconds: number,
  minutes: number,
  hours: number,
  day: number,
  alarmHour: number,
  alarmMins: number,
  alarm: string
}

const machineConfig: MachineConfig<TContext, AnyStateNodeDefinition, TEvent> = {
  id: "TimerMachine",
    type: "parallel",
    context: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      date: new Date().getDate(),
      seconds: new Date().getSeconds(),
      minutes: new Date().getMinutes(),
      hours: new Date().getHours(),
      day: new Date().getDay(),
      alarmHour: 3,
      alarmMins: 37,
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
              SET_ALARM: {
                actions: ["setAlarmHourInput", "setAlarmMinsInput", (context) => console.log("PJ", context.alarmHour, context.alarmMins)]
              }
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
                actions: ["setAlarmOff", "setAlarmHour", "setAlarmMins"]
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
                  actions: ["resetSeconds", "incrementMinutes"],
                },
                {
                  cond: "checkIfMinutesEqualsSixty",
                  actions: ["resetMinutes", "incrementHours"],
                },
                {
                  cond: "checkIfHoursEqualsTwelve",
                  actions: [
                    "resetMinutes",
                    "resetHours",
                    "resetSeconds", "incrementDay",
                  ],
                },
                {
                  cond: "checkIfDaysEqualsSeven",
                  actions: ["restartDay"]
                },
                {
                  actions: ["incrementSeconds"],
                },
              ],
              RESET: {
                actions: [
                  "resetSeconds",
                  "resetMinutes",
                  "resetHours",
                  "resetDay"
                ],
              },
            },
          },
        },
      },
    },
}

const timerMachine = Machine(
machineConfig,
  {
    actions: {
      incrementSeconds: assign({
        seconds: ({seconds}) => seconds + 1,
      }),
      incrementMinutes: assign({
        minutes: ({minutes}) => minutes + 1,
      }),
      incrementHours: assign({
        minutes: ({hours}) => hours + 1,
      }),
      incrementDay: assign({ day: ({day}) => day + 1}),
      resetSeconds: assign({ seconds: () => new Date().getSeconds() }),
      resetMinutes: assign({ minutes: () => new Date().getMinutes() }),
      resetHours: assign({ hours: () => new Date().getHours() }),
      resetDay: assign({day: ({day}) => new Date().getDay()}),
      restartDay: assign({day: ({day}) => 1}),
      setAlarmOn: assign({ alarm: () => "on" }),
      setAlarmOff: assign({ alarm: () => "off" }),
      setAlarmHour: assign({alarmHour: ({alarmHour}) => alarmHour - 1}),
      setAlarmMins: assign({alarmMins: ({alarmMins}) => alarmMins - 1}),
      setAlarmHourInput: assign({alarmHour: (_, {payload}) => + (payload?.split(":")[0]) }),
      setAlarmMinsInput: assign({alarmMins: (_, {payload}) => +(payload?.split(":")[1])  })
    },
    services: {
      timer: () => (send) => {
        setInterval(() => send("TICK"), 1000);
      },
    },
    guards: {
      checkIfSecondsEqualsSixty: ({seconds}) => seconds === 59,
      checkIfMinutesEqualsSixty: ({minutes}) => minutes === 59,
      checkIfHoursEqualsTwelve: ({hours}) => hours === 12,
      checkIfTimeEqualsAlarmTime: ({hours, alarmHour, minutes, alarmMins}) =>
        hours === alarmHour &&
        minutes === alarmMins,
      checkIfDaysEqualsSeven: ({day}) => day === 7,
    },



  }
);

export default timerMachine;
