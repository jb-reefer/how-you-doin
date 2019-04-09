// TODO: jest test this
export class AlertTracker {
  alertActiveSince?: Date;

  /**
  Whenever the load for the past 2 minutes exceeds 1 on average, add a message saying that “High load generated an alert - load = { value }, triggered at { time } ”
  
  Whenever the load average drops again below 1 on average for the past 2 minutes, add another message explaining when the alert recovered.
 */
  getMessage = (percentFree: number) => {
    const twoMinutesAgo = new Date(new Date().getMinutes() - 2);

    if (percentFree <= 0.05) {
      if (!this.alertActiveSince) {
        this.alertActiveSince = new Date();
        return;
      }
      if (this.alertActiveSince <= twoMinutesAgo) {
        return `High load generated an alert - load = ${percentFree}`;
      }
    }

    if (percentFree > 0.05 && this.alertActiveSince) {
      if (this.alertActiveSince <= twoMinutesAgo) {
        this.alertActiveSince = undefined;
        return `High load alert recovered`;
      }
    }
  }
}
