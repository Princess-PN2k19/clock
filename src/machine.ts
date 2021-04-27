import { Machine, assign } from "xstate";

const timerMachine = Machine(
  {
    id: "TimerMachine",
    initial: "idle",
    context: {
      seconds: new Date().getSeconds(),
      minutes: new Date().getMinutes(),
      hours: new Date().getHours(),
    },
    invoke: {
      id: "Timer",
      src: "timer",
    },
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
              actions: ["incrementSeconds"],
            },
          ],
          RESET: {
            actions: ["setSecondsToZero", "setMinutesToZero", "setHoursToZero"],
          },
        },
      },
    },
  },
  {
    actions: {
      incrementSeconds: assign({
        seconds: (context, _) => context.seconds + 1,
      }),
      incrementMinutes: assign({
        minutes: (context, _) => context.minutes + 1,
      }),
      incrementHours: assign({
        minutes: (context, _) => context.seconds + 1,
      }),
      setSecondsToZero: assign({ seconds: (context, _) => 0 }),
      setMinutesToZero: assign({ minutes: (context, _) => 0 }),
      setHoursToZero: assign({ hours: (context, _) => 0 }),
    },
    services: {
      timer: (context, _) => (send) => {
        setInterval(() => send("TICK"), 1000);
      },
    },
    guards: {
        checkIfSecondsEqualsSixty: (context, _) =>  (context.seconds === 60),
        checkIfMinutesEqualsSixty: (context, _) =>  (context.minutes === 60),
    },
  }
);

export default timerMachine;
