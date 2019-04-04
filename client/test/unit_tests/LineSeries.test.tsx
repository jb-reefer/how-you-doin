import React from "react";
import ReactDOM from "react-dom";
import { XYPlot, LineSeries } from "react-vis";

const data = [ { y: Math.random(), x: 1 }, { y: Math.random(), x: 2 }, { y: Math.random(), x: 3 }];

it("renders a <LineSeries />", () => {
  const div = document.createElement("div");
  ReactDOM.render(<XYPlot height={300} width={500}><LineSeries data={data} /></XYPlot>, div);
  ReactDOM.unmountComponentAtNode(div);
});
