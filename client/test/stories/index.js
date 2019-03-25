import { storiesOf } from "@storybook/react";
import { Button } from "@storybook/react/demo";
import { Alert } from '../../src/components/Alert'
import React from "react";

storiesOf("Button", module)
  .add("with text", () => (
    <Button>Hello Button</Button>
  ))
  .add("with emoji", () => (
    <Button><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
  ));

storiesOf("Alert", module)
  .add("Here's my alert!", () => (
    <Alert kind="Info">Meow!</Alert>
  ))
