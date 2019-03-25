import React from "react";
import "./Alert.css";

type alertType = "Info" | "Warning" | "Error";

export const Alert = (props: { kind: alertType, closeHandler: any, children: any }) => (
  <div className={"Alert " + props.kind } onClick={props.closeHandler}>
    <div>{props.children}</div>
    <div className="X">X</div>
  </div>
);
