import * as React from "react";
import "./Messages.css";

const Messages = (props: {children: string[]}) => (
  <div className="Messages">
    <ul>
      {props.children.map((message) => <li>{message}</li>)}
    </ul>
  </div>
);

export { Messages };
