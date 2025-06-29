import { INACTIVITY_THRESHOLD } from "../constants";

export class InactivityTracker {
  static lastRequestTime: number = Date.now();

  static reset() {
    InactivityTracker.lastRequestTime = Date.now();
  }

  static getInactiveTime() {
    return Date.now() - InactivityTracker.lastRequestTime;
  }

  static isInactive() {
    const threshold = INACTIVITY_THRESHOLD;
    return InactivityTracker.getInactiveTime() >= threshold;
  }
}
