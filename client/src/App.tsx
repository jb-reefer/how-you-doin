import React, { Component } from 'react';
import { Alert } from './components/Alert';
import { XYPlot, XAxis, YAxis, LineSeries, HorizontalGridLines, VerticalGridLines, Crosshair } from 'react-vis';
import './App.scss';

interface CPUData {
  x: Date;
  y: number;
}

// TODO: better naming!
interface AppState {
  cpuData: CPUData[];
  crosshairValues: any;
}

class App extends Component<any, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      cpuData: [],
      crosshairValues: []
    };
    
    this.getCPUData().then(() => setInterval(this.getCPUData, 10 * 1000));
  }

  getCPUData = () => {
    return fetch('/api/cpu')
      .then(response => { 
        console.log(response);
        return response.text()
      })
      .then(percent => {
        const buffer: CPUData[] = this.state.cpuData.concat({
          x: new Date(),
          y: parseFloat(percent)
        })
        this.setState({
          cpuData: buffer
        });
      })
  }

  // TODO: pretty this up
  _onMouseLeave = () => {
    this.setState({ crosshairValues: [] });
  };

  _onNearestX = (value, { index }) => {
    this.setState({ crosshairValues: this.state.cpuData.map(d => d[index]) });
  };

  render = () => {
    return (
      <div className="App">
        <Alert kind='Info'>Grumpy</Alert>
        <h1>CPU %</h1>
        <XYPlot 
          height={400} 
          width={900} 
          onMouseLeave={this._onMouseLeave}
          onNearestX={this._onNearestX}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis 
            width={50}
            tickFormat={v => {
            const day = new Date(v);
              return `${day.getHours()}:${day.getMinutes()}:${day.getSeconds()}`
          }} tickLabelAngle={-90}/>
          <YAxis yDomain={[0, 100]} />
          <LineSeries
            data={this.state.cpuData}
            opacity={1}
            strokeStyle="solid"
            curve='curveStep'
          >
          </LineSeries>
          <Crosshair values={this.state.crosshairValues}>
            <div style={{ background: 'black' }}>
              <h3>Values of crosshair:</h3>
              <p>x: {this.state.crosshairValues}</p>
              <p>y: {this.state.crosshairValues}</p>
            </div>
          </Crosshair>
        </XYPlot>
      </div>
    );
  }
}

export default App;
