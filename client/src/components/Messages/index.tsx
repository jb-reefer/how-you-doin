import * as React from "react";
import "./Messages.css";

const Messages = (props: any) => (
  <div className="Messages">
    <ul>
      <li>{new Date().toLocaleTimeString()} Here's a message!</li>
      <li>{new Date().toLocaleTimeString()} Here's another message!</li>
      <li>{new Date().toLocaleTimeString()} Here's a third message!</li>
    </ul>
  </div>
)

export { Messages }
