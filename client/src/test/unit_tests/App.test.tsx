import React from "react";
import ReactDOM from "react-dom";
import App from "../../App";
import oneCpuMockData from "./dummyData";

it("Renders without crashing", () => {
  const div = document.createElement("div");
  const mockCpuData = {
    all: oneCpuMockData,
    0: oneCpuMockData,
  };
  ReactDOM.render(<App cpuData={mockCpuData} messages={[]} closeAlertHandler={() => {}}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
