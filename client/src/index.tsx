import React from "react";
import ReactDOM from "react-dom";
import App, { ICPUData } from "./App";

// Whenever the load for the past 2 minutes exceeds 1 on average, add a message saying that “High load generated an alert - load = { value }, triggered at { time } ”
// Whenever the load average drops again below 1 on average for the past 2 minutes, Add another message explaining when the alert recovered.
// Make sure all messages showing when alerting thresholds are crossed remain visible on the page for historical reasons.

const SAMPLING_INTERVAL = 10 * 1000;
const cpuData: { [s: string]: ICPUData[]; } = { all: [] };
const messages: string[] = [];
let message: string | undefined;

// TODO: jest test this
const StoreCPUData = (cpuName: string, idle: number) => {
  cpuData[cpuName] = (cpuData[cpuName] || []).concat({
    x: new Date(),
    y: 100.00 - idle,
  });

  // Only keep 10 minutes of samples
  if (cpuData[cpuName].length + 1 > tenMinutesOfSamples()) {
    cpuData[cpuName].shift();
  }
}

const getCPUData = () => {
  return fetch("/api/cpu")
    .then((response) => response.json())
    .then((data: Array<{ cpu: string, idle: number }>) => {
      data.forEach((record) => StoreCPUData(record.cpu, record.idle));
    })
    .catch((error: Error) => {
      message = error.message;
      messages.unshift(buildMessage(error.message));
    });
}

const tenMinutesOfSamples = () => {
  const tenMinutesMills = 10 * 60 * 1000;
  return tenMinutesMills / SAMPLING_INTERVAL;
};

getCPUData().then(() => setInterval(getCPUData, SAMPLING_INTERVAL));

const closeAlertHandler = () => {
  message = undefined;
};

const buildMessage = (text: string) => (new Date().toLocaleTimeString() + " : " + text);

ReactDOM.render(
  <App
    cpuData={cpuData}
    messages={messages}
    alert={message}
    closeAlertHandler={closeAlertHandler}
  />,
  document.getElementById("root"));
