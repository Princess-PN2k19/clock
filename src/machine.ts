import { Machine, assign, MachineConfig, AnyStateNodeDefinition } from "xstate";

type TEvent = {
  type: string;
  payload: string;
};

type TContext = {
  year: number;
  month: number;
  date: number;
  seconds: number;
  minutes: number;
  hours: number;
  day: number;
  alarmHour: number;
  alarmMins: number;
  alarm: string;
  thirties: number[];
  thirty_ones: number[];
  twenty_eight: number[];
};

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
    thirties: [3, 5, 8, 10],
    thirty_ones: [0, 2, 4, 6, 7, 9, 11],
    twenty_eight: [1],
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
              actions: [
                "setAlarmHourInput",
                "setAlarmMinsInput",
              ],
            },
          },
        },
        alarmOn: {
          activities: ["beeping"],
          after: {
            10000: {
              target: "alarmOff",
              actions: "setAlarmOff",
            },
          },
          on: {
            STOP: {
              target: "alarmOff",
              actions: ["setAlarmOff", "setAlarmHour", "setAlarmMins"],
            },
          },
        },
      },
    },
    time: {
      initial: "idle",
      states: {
        idle: {
          on: {
            TICK: [
              {
                cond: "checkIfSecondsEqualsSixty",
                actions: ["restartSec", "incrementMinutes"],
              },
              {
                cond: "checkIfMinutesEqualsSixty",
                actions: ["restartMins", "incrementHours"],
              },
              {
                cond: "checkIfHoursEqualsTwentyFour",
                actions: ["incrementDate", "incrementDay", "restartHours"],
              },
              {
                cond: "checkIfDaysEqualsSeven",
                actions: ["restartDay"],
              },
              {
                cond: "checkIfMonthInThirties",
                actions: ["incrementMonth", "restartDate"],
              },
              {
                cond: "checkIfMonthInThirtyOnes",
                actions: ["incrementMonth", "restartDate"],
              },
              {
                cond: "checkIfMonthInTwentyEight",
                actions: ["incrementMonth", "restartDate"],
              },
              {
                cond: "checkIfMonthsEqualsTwelve",
                actions: ["incrementYear", "restartMonth"],
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
                "resetDay",
                "resetDate",
                "resetMonth",
                "resetYear",
              ],
            },
          },
        },
      },
    },
  },
};

const timerMachine = Machine(machineConfig, {
  actions: {
    incrementSeconds: assign({
      seconds: ({ seconds }) => seconds + 1,
    }),
    incrementMinutes: assign({
      minutes: ({ minutes }) => minutes + 1,
    }),
    incrementHours: assign({
      hours: ({ hours }) => hours + 1,
    }),
    incrementDay: assign({ day: ({ day }) => day + 1 }),
    incrementDate: assign({ date: ({ date }) => date + 1 }),
    incrementMonth: assign({ month: ({ month }) => month + 1 }),
    incrementYear: assign({ year: ({ year }) => year + 1 }),
    resetSeconds: assign({ seconds: () => new Date().getSeconds() }),
    resetMinutes: assign({ minutes: () => new Date().getMinutes() }),
    resetHours: assign({ hours: () => new Date().getHours() }),
    resetDay: assign({ day: () => new Date().getDay() }),
    resetDate: assign({ date: () => new Date().getDate() }),
    resetMonth: assign({ month: () => new Date().getMonth() }),
    resetYear: assign({ year: () => new Date().getFullYear() }),
    restartSec: assign({ seconds: () => 1 }),
    restartMins: assign({ minutes: () => 1 }),
    restartHours: assign({ hours: () => 1 }),
    restartDay: assign({ day: () => 1 }),
    restartDate: assign({ date: () => 1 }),
    restartMonth: assign({ month: () => 1 }),
    setAlarmOn: assign({ alarm: () => "on" }),
    setAlarmOff: assign({ alarm: () => "off" }),
    setAlarmHour: assign({ alarmHour: ({ alarmHour }) => alarmHour - 1 }),
    setAlarmMins: assign({ alarmMins: ({ alarmMins }) => alarmMins - 1 }),
    setAlarmHourInput: assign({
      alarmHour: (_, { payload }) => +payload?.split(":")[0],
    }),
    setAlarmMinsInput: assign({
      alarmMins: (_, { payload }) => +payload?.split(":")[1],
    }),
  },
  services: {
    timer: () => (send) => {
      setInterval(() => send("TICK"), 0.999999999);
    },
  },
  guards: {
    checkIfSecondsEqualsSixty: ({ seconds }) => seconds === 61,
    checkIfMinutesEqualsSixty: ({ minutes }) => minutes === 61,
    checkIfHoursEqualsTwentyFour: ({ hours }) => hours === 24,
    checkIfTimeEqualsAlarmTime: ({ hours, alarmHour, minutes, alarmMins }) =>
      hours === alarmHour && minutes === alarmMins,
    checkIfDaysEqualsSeven: ({ day }) => day === 7,
    checkIfMonthInThirties: ({ month, thirties, date }) =>
      thirties.includes(month) && date === 30,
    checkIfMonthInThirtyOnes: ({ month, thirty_ones, date }) =>
      thirty_ones.includes(month) && date === 31,
    checkIfMonthInTwentyEight: ({ month, twenty_eight, date }) =>
      twenty_eight.includes(month) && date === 28,
    checkIfMonthsEqualsTwelve: ({ month }) => month === 12,
  },
  activities: {
    beeping: () => {
      //Start the beeping activity
      const interval = setInterval(() => console.log("BEEP! BEEP!"), 1000);

      //Return a function that stops the beeping activity
      return () => clearInterval(interval);
    },
  },
});

export default timerMachine;
