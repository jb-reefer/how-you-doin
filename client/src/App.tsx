import React, { Component } from 'react';
import { Alert } from './components/Alert';
import { XYPlot, Crosshair, LineSeries, HorizontalGridLines, VerticalGridLines } from 'react-vis';
import './App.scss';

const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => {
  return {
    x: value,
    y: Math.random()
  };
})

class App extends Component {
  render() {
    return (
      <div className="App">
        I'm a little teapot
        <Alert kind='Info'>Grumpy</Alert>
        <XYPlot height={300} width={500} 
        onNearestXY={(value) => this.setState({crosshairValues: value})} >
          <VerticalGridLines />
          <HorizontalGridLines />
          <LineSeries
            data={data}
            opacity={1}
            strokeStyle="solid"
            curve='curveStep'
          />
          <Crosshair values={data}>
            <div style={{ background: 'black' }}>
              <h3>Values of crosshair:</h3>
              <p>x: {this.state}</p>
              <p>y: {this.state}</p>
            </div>
          </Crosshair>
        </XYPlot>
      </div>
    );
  }
}

export default App;
