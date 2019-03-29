import * as React from "react";
import { Crosshair, HorizontalGridLines, LineSeries, VerticalGridLines, XAxis, XYPlot, YAxis } from "react-vis";
import { ICPUData } from "../../App";
import "./CPUGraph.scss";

interface IGraphProps {
  cpuData: ICPUData[];
}

interface IGraphState {
  crosshairValue?: ICPUData;
}

export class CPUGraph extends React.Component<IGraphProps, IGraphState> {
  constructor(props) {
    super(props);

    this.state = {
      crosshairValue: undefined,
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
        {this.state.crosshairValue && <Crosshair values={[this.state.crosshairValue]}>
          <div style={{ color: "white", textAlign: "center", border: "solid", background: "grey", borderRadius: "10px", minWidth: "100px" }}>
            <p>{this.state.crosshairValue.x.toLocaleTimeString()}</p>
            <p>{this.state.crosshairValue.y}%</p>
          </div>
        </Crosshair>}
    </XYPlot>);
  }

  private onMouseLeave = () => {
    this.setState({ crosshairValue: undefined });
  }

  private onNearestXY = (value) => {
    this.setState({ crosshairValue: value });
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
