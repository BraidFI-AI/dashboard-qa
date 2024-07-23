export class InactivityTracker {
  static lastRequestTime: number = Date.now();

  static reset() {
    InactivityTracker.lastRequestTime = Date.now();
  }

  static getInactiveTime() {
    return Date.now() - InactivityTracker.lastRequestTime;
  }

  static isInactive() {
    const threshold = 15 * 60 * 1000; // 15 minutes
    return InactivityTracker.getInactiveTime() >= threshold;
  }
}
