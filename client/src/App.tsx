import React, { Component } from "react";
import "./App.css";
import { Alert } from "./components/Alert";
import { CPUGraph } from "./components/CPUGraph";
import { Messages } from "./components/Messages";

export interface ICPUData {
  x: Date;
  y: number;
}

interface IAppProps {
  cpuData: { [s: string]: ICPUData[]; };
  messages: string[];
  alert?: string;
  closeAlertHandler: () => void;
}

const App = (props: IAppProps) => (
  <div className="App">
    <div className="Graph">
    {props.alert &&
      <Alert kind="Error" closeHandler={props.closeAlertHandler}>
        {props.alert}
      </Alert>}
    {
      Object.entries(props.cpuData).sort().map(([name, cpuData]) => (
        <div key={name}>
          <h1>CPU {name}</h1>
          <CPUGraph cpuData={cpuData} />
        </div>
      ))
    }
    </div>
    <Messages>{props.messages}</Messages>
  </div>
);

export default App;
