import React from "react";
import ReactDOM from "react-dom";
import { AlertTracker } from "./alertTracker";
import App, { ICPUData } from "./App";

const SAMPLING_INTERVAL = 10 * 1000;
const cpuData: { [s: string]: ICPUData[]; } = { all: [] };
const messages: string[] = [];
let alert: string | undefined;

const alertTracker = new AlertTracker();

const handleNewCPUData = (cpuName: string, idle: number) => {
  const percentFree = 100.00 - idle;
  cpuData[cpuName] = (cpuData[cpuName] || []).concat({
    x: new Date(),
    y: percentFree,
  });

  // Only keep 10 minutes of samples
  if (cpuData[cpuName].length + 1 > tenMinutesOfSamples()) {
    cpuData[cpuName].shift();
  }

  const message = alertTracker.getMessage(percentFree);
  if (message) {
    handleMessage(message);
  }
};

const getCPUData = () => {
  return fetch("/api/cpu")
    .then((response) => response.json())
    .then((data: Array<{ cpu: string, idle: number }>) => {
      data.forEach((record) => handleNewCPUData(record.cpu, record.idle));
    })
    .catch((error: Error) => handleMessage(error.message));
};

/**
 *  Set the alert and make sure all messages showing when alerting thresholds are crossed remain visible on the page for historical reasons.
*/
const handleMessage = (message: string) => {
  alert = message;
  messages.unshift(buildMessage(message));
};

const tenMinutesOfSamples = () => {
  const tenMinutesMills = 10 * 60 * 1000;
  return tenMinutesMills / SAMPLING_INTERVAL;
};

getCPUData().then(() => setInterval(getCPUData, SAMPLING_INTERVAL));

const closeAlertHandler = () => {
  alert = undefined;
};

const buildMessage = (text: string) => (`${text}, triggered at ${new Date().toLocaleTimeString()}`);

ReactDOM.render(
  <App
    cpuData={cpuData}
    messages={messages}
    alert={alert}
    closeAlertHandler={closeAlertHandler}
  />,
  document.getElementById("root"));
