import React, { Component } from "react";
import "./App.css";
import { Alert } from "./components/Alert";
import { CPUGraph } from "./components/CPUGraph";
import { Messages } from "./components/Messages";

export interface ICPUData {
  x: Date;
  y: number;
}

interface IAppState {
  cpuData: { [s: string]: ICPUData[]; };
  messages: string[];
  error?: Error;
}

const SAMPLING_INTERVAL = 10 * 1000;

class App extends Component<any, IAppState> {
  constructor(props) {
    super(props);
    this.state = {
      cpuData: { "all" : [] },
      messages: [],
    };
  }

  componentDidMount = () => {
    this.getCPUData().then(() => setInterval(this.getCPUData, SAMPLING_INTERVAL));
  }

  render = () => {
    return (
      <div className="App">
        <div className="Graph">
        {this.state.error &&
          <Alert kind="Error" closeHandler={this.closeAlertHandler}>
            {this.state.error.message}
          </Alert>}
        {
          Object.entries(this.state.cpuData).sort().map(([name, cpuData]) => (
            <>
              <h1>CPU {name}</h1>
              <CPUGraph cpuData={cpuData} />
            </>
          ))
        }
        </div>
        <Messages>{this.state.messages}</Messages>
      </div>
    );
  }

  closeAlertHandler = () => {
    this.setState({
      error: undefined,
    });
  }

  tenMinutesOfSamples = () => {
    const tenMinutesMills = 10 * 60 * 1000;
    return tenMinutesMills / SAMPLING_INTERVAL;
  }

  // TODO: jest test this
  addCPUDataToState = (cpuName: string, idle: number) => {
    const cpuData = this.state.cpuData;
    // TODO: there's a prettier way to do this
    if (!cpuData[cpuName]) {
      cpuData[cpuName] = [];
    }
    cpuData[cpuName] = cpuData[cpuName].concat({
      x: new Date(),
      y: 100.00 - idle,
    });

    // Only keep 10 minutes of samples
    if (cpuData[cpuName].length + 1 > this.tenMinutesOfSamples()) {
      cpuData[cpuName].shift();
    }
    this.setState({
      cpuData,
    });
  }

  getCPUData = () => {
    return fetch("/api/cpu")
      .then((response) => response.json())
      .then((data: Array<{cpu: string, idle: number}>) => {
        data.forEach((record) => this.addCPUDataToState(record.cpu, record.idle));
      })
      .catch((error: Error) => {
        this.setState({
          error,
          messages: this.state.messages.concat(this.buildMessage(error.message)),
        });
      });
  }

  buildMessage = (text: string) => (new Date().toLocaleTimeString() + " : " + text);
}

export default App;
