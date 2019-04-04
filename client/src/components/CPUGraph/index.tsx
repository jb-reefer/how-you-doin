import * as React from "react";
import { Crosshair, HorizontalGridLines, LineSeries, XAxis, XYPlot, YAxis } from "react-vis";
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

  onMouseLeave = () => {
    this.setState({ crosshairValue: undefined });
  }

  onNearestXY = (value) => {
    this.setState({ crosshairValue: value });
  }

  // TODO: test the shit out of this
  getXDomain = () => {
    const oldest = this.props.cpuData[0];
    const youngest = this.props.cpuData[this.props.cpuData.length - 1];

    if (!oldest || !youngest || new Date(oldest.x.getTime() - youngest.x.getTime()).getMinutes() <= 10) {
      const rightHandSide = (youngest && youngest.x) || new Date();
      const tenMinutesAgo = (new Date()).setMinutes(rightHandSide.getMinutes() - 10);
      return [tenMinutesAgo, rightHandSide.getTime()];
    }

    return [oldest.x.getTime(), youngest.x.getTime()];
  }

  render = () => {
    return (
      <XYPlot
        height={400}
        width={800}
        onMouseLeave={this.onMouseLeave}
        xDomain={this.getXDomain()}
        yDomain={[0, 100]}
      >
        <HorizontalGridLines />
        <XAxis
          width={50}
          tickFormat={(v) => {
            const day = new Date(v);
            return `${day.getHours()}:${day.getMinutes()}:${day.getSeconds()}`;
          }} tickLabelAngle={-90} />
        <YAxis />
        <LineSeries
          data={this.props.cpuData}
          opacity={1}
          strokeStyle="solid"
          curve="curveStep"
          onNearestXY={this.onNearestXY}
        >
        </LineSeries>
        {this.state.crosshairValue && <Crosshair
          values={[this.state.crosshairValue]}>
          <div style={{ color: "white", textAlign: "center", background: "rgb(18, 147, 154)", padding: "3px", borderRadius: "10px", fontSize: "120%", minWidth: "100px" }}>
            <p>CPU: {this.state.crosshairValue.y}%</p>
            <p>{this.state.crosshairValue.x.toLocaleTimeString()}</p>
          </div>
        </Crosshair>}
      </XYPlot>);
  }
}
