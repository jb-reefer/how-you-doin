import * as React from "react";
import { Crosshair, HorizontalGridLines, LineSeries, VerticalGridLines, XAxis, XYPlot, YAxis, Hint } from "react-vis";
import { ICPUData } from "../../App";
import "./CPUGraph.scss";

interface IGraphProps {
  cpuData: ICPUData[];
}

interface IGraphState {
  crosshairValues?: ICPUData;
}

export class CPUGraph extends React.Component<IGraphProps, IGraphState> {
  constructor(props) {
    super(props);

    this.state = {
      crosshairValues: this.props.cpuData[0],
    };
  }

  public render = () => {
    return (
      <XYPlot
        height={400}
        width={800}
        onMouseLeave={this.onMouseLeave}
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
          data={this.props.cpuData}
          opacity={1}
          strokeStyle="solid"
          curve="curveStep"
          onNearestXY={this.onNearestXY}
        >
        </LineSeries>
        {this.state.crosshairValues && <Hint value={this.state.crosshairValues}>
          <div style={{ background: "black" }}>
            <h3>Values of crosshair:</h3>
            <p>x: {this.state.crosshairValues.x.toLocaleTimeString()}</p>
            <p>y: {this.state.crosshairValues.y}</p>
          </div>
        </Hint>}
    </XYPlot>);
  }

  // TODO: pretty this up
  private onMouseLeave = () => {
    this.setState({ crosshairValues: undefined });
  }

  private onNearestXY = (value) => {
    console.log('vlue', value)
    this.setState({ crosshairValues: value });
  }

  private getXDomain = () => {
    const oldest = this.props.cpuData[0].x;
    const youngest = this.props.cpuData[this.props.cpuData.length - 1].x;

    if (new Date(oldest.getTime() - youngest.getTime()).getMinutes() <= 10) {
      const tenMinutesAgo = (new Date()).setMinutes(youngest.getMinutes() - 10);
      return [tenMinutesAgo, youngest.getTime()];
    }

    return [oldest.getTime(), youngest.getTime()];
  }
}
