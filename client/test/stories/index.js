import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from '@storybook/addon-actions';
import { Alert } from '../../src/components/Alert'
import { Messages } from '../../src/components/Messages'
import { CPUGraph } from '../../src/components/CPUGraph'
import dummyCPUData from "../../src/test/dummyData";

storiesOf("Alert", module)
.add("Alerts - All", () => (<>
    <Alert kind="Info" closeHandler={action("Clicked!")} >An informative message</Alert>
    <br />
    <Alert kind="Warning" closeHandler={action("Clicked!")} >A warning!</Alert>
    < br />    
    <Alert kind="Error" closeHandler={action("Clicked!")} >Something bad happened!</Alert>
  </>))
  .add("Alert - Info", () => (
    <Alert kind="Info" closeHandler={action("Clicked!")} >An informative message</Alert>
  ))
  .add("Alert - Warning", () => (
    <Alert kind="Warning" closeHandler={action("Clicked!")} >A warning!</Alert>
  ))
  .add("Alert - Error", () => (
    <Alert kind="Error" closeHandler={action("Clicked!")} >Something bad happened!</Alert>
  ))

storiesOf("Messages", module)
.add("Messages - short", () => (
  <Messages>{["I'm a short message", "Short", "Not Long", "Doesn't Wrap"]}</Messages>
))
.add("Messages - long", () => (
  <Messages> 
    {["Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "Short", "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,", "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"]}
  </Messages>
))

storiesOf("CPUGraph", module)
  .add("Single graph", () => (
    <CPUGraph cpuData={dummyCPUData} />
  ))
  .add("4 graphs", () => (
  <>
    <CPUGraph cpuData = {dummyCPUData} />
    <br />
    <CPUGraph cpuData = {dummyCPUData} />
    < br />
    <CPUGraph cpuData = {dummyCPUData} />
    < br />
    <CPUGraph cpuData = {dummyCPUData} />
  </>)
);
