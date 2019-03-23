import React, { Component } from 'react';
import { Alert } from './components/Alert';
import { XYPlot, XAxis, YAxis, LineSeries, HorizontalGridLines, VerticalGridLines, Crosshair } from 'react-vis';
import './App.scss';

interface CPUData {
  x: Date;
  y: number;
}
const dummyData: CPUData[] = [ 
{ x: new Date('2019-03-23T20:15:39.450Z'), y: 80 },
{ x: new Date('2019-03-23T20:15:40.213Z'), y: 15 },
{ x: new Date('2019-03-23T20:15:41.224Z'), y: 67 },
{ x: new Date('2019-03-23T20:15:42.219Z'), y: 51 },
{ x: new Date('2019-03-23T20:15:43.218Z'), y: 53 },
{ x: new Date('2019-03-23T20:15:44.240Z'), y: 56 },
{ x: new Date('2019-03-23T20:15:45.227Z'), y: 59 },
];
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
      <div className="App" style={{display: 'flex'}}>
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
