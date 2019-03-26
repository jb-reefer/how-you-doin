import React, { Component } from "react";
import { Crosshair, HorizontalGridLines, LineSeries, VerticalGridLines, XAxis, XYPlot, YAxis } from "react-vis";
import "./App.scss";
import { Alert } from "./components/Alert";
import { Messages } from "./components/Messages";

interface ICPUData {
  x: Date;
  y: number;
}

interface IAppState {
  cpuData: ICPUData[];
  crosshairValues: any;
  messages: string[];
  error?: Error;
}

const SAMPLING_INTERVAL = 10 * 1000;

class App extends Component<any, IAppState> {
  constructor(props) {
    super(props);
    this.state = {
      cpuData: [],
      crosshairValues: [],
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
        <XYPlot
          height={400}
          width={800}
          onMouseLeave={this.onMouseLeave}
          onNearestX={this.onNearestX}
          xDomain={this.getXDomain()}
          yDomain={[0, 100]}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis
            width={50}
            tickFormat={(v) => {
            const day = new Date(v);
            return `${day.getHours()}:${day.getMinutes()}:${day.getSeconds()}`;
          }} tickLabelAngle={-90}/>
          <YAxis />
          <LineSeries
            data={this.state.cpuData}
            opacity={1}
            strokeStyle="solid"
            curve="curveStep"
          >
          </LineSeries>
          <Crosshair values={this.state.crosshairValues}>
            <div style={{ background: "black" }}>
              <h3>Values of crosshair:</h3>
              <p>x: {this.state.crosshairValues}</p>
              <p>y: {this.state.crosshairValues}</p>
            </div>
          </Crosshair>
        </XYPlot>
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

  // TODO: pretty this up
  private onMouseLeave = () => {
    this.setState({ crosshairValues: [] });
  }

  private onNearestX = (value, { index }) => {
    this.setState({ crosshairValues: this.state.cpuData.map((d) => d[index]) });
  }

  private getXDomain = () => {
    const now = new Date();
    const tenMinutesAgo = (new Date()).setMinutes(now.getMinutes() - 10);
    return [tenMinutesAgo, now.getTime()];
  }
}

export default App;
