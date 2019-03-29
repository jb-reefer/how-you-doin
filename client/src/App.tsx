import React, { Component } from "react";
import "./App.css";
import { Alert } from "./components/Alert";
import { Messages } from "./components/Messages";

export interface ICPUData {
  x: Date;
  y: number;
}

interface IAppState {
  cpuData: ICPUData[];
  messages: string[];
  error?: Error;
}

const SAMPLING_INTERVAL = 10 * 1000;

class App extends Component<any, IAppState> {
  constructor(props) {
    super(props);
    this.state = {
      cpuData: [],
      messages: [],
    };

    this.getCPUData().then(() => setInterval(this.getCPUData, SAMPLING_INTERVAL));
  }

  public render = () => {
    return (
      <div className="App">
        <div className="Graph">
        {this.state.error &&
          <Alert kind="Error" closeHandler={this.closeAlertHandler}>
            {this.state.error.message}
          </Alert>}
        <h1>CPU %</h1>
        </div>
        <Messages>{this.state.messages}</Messages>
      </div>
    );
  }

  private closeAlertHandler = () => {
    this.setState({
      error: undefined,
    });
  }

  private tenMinutesOfSamples = () => {
    const tenMinutesMills = 10 * 60 * 1000;
    return tenMinutesMills / SAMPLING_INTERVAL;
  }

  private getCPUData = () => {
    return fetch("/api/cpu")
      .then((response) => response.text())
      .then((percent: string) => {
        const y = parseFloat(percent);
        if (isNaN(y)) {
          throw new Error("Could not parse cpu data from server");
        }

        const buffer: ICPUData[] = this.state.cpuData.concat({
          x: new Date(),
          y,
        });

        // Only keep 10 minutes of samples
        // TODO: set the xDomain attr below
        if (buffer.length + 1 > this.tenMinutesOfSamples()) {
          buffer.shift();
        }
        this.setState({
          cpuData: buffer,
        });
      })
      .catch((error: Error) => {
        this.setState({
          error,
          messages: this.state.messages.concat(this.buildMessage(error.message)),
        });
      });
  }

  private buildMessage = (text: string) => (new Date().toLocaleTimeString() + " : " + text);
}

export default App;
