import { storiesOf } from "@storybook/react";
import { Button } from "@storybook/react/demo";
import { Alert } from '../../src/components/Alert'
import React from "react";
import {
  action,
  configureActions
} from '@storybook/addon-actions';


storiesOf("Button", module)
  .add("with text", () => (
    <Button>Hello Button</Button>
  ))
  .add("with emoji", () => (
    <Button><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
  ));

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
