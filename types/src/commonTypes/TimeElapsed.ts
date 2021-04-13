import { TimerFor } from './SharedEnums';

export interface TimeElapsed {
  timerFor: TimerFor;
  timeElapsed: number; //number of seconds elapsed since the last TimerElapsed event
}
export interface TimerParameters {
  timerFor: TimerFor;
  interval: number; //time interval in seconds between successive timer event while time remaining is more than 1 minute
  intervalDuringLastMinute?: number; //time interval in seconds between successive timer event while time remaining is less than 1 minute. If undefined, use the value of interval above
}
