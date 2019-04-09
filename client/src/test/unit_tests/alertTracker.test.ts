import assert from "assert";
import { AlertTracker } from "../../alertTracker";

/**
  Whenever the load for the past 2 minutes exceeds 1 on average, add a message saying that “High load generated an alert - load = { value }, triggered at { time } ”

  Whenever the load average drops again below 1 on average for the past 2 minutes, add another message explaining when the alert recovered.
 */
describe("Alert notification tests", () => {
  it("Should return a high load alert if utilization has been high for > 2 minutes", () => {
    const tracker = new AlertTracker();
    tracker.alertActiveSince = new Date(0);
    const message = tracker.getMessage(100);
    assert(message);
  });

  it("Should not return a high load alert if utilization has been high for < 2 minutes", () => {
    const tracker = new AlertTracker();
    tracker.alertActiveSince = new Date();

    const message = tracker.getMessage(100);
    assert(!message, "should not get a message, got ", message);
  });

  it("Should not return a high load alert, then no alert, then a high load alert given appropriate data", () => {
    const tracker = new AlertTracker();
    tracker.alertActiveSince = new Date(0);

    const noUsageMessage = tracker.getMessage(100);
    assert(noUsageMessage);
    assert(!tracker.alertActiveSince);
    const singleSpikeMessage = tracker.getMessage(0);
    assert(!singleSpikeMessage);
    assert(tracker.alertActiveSince);
  });
})
