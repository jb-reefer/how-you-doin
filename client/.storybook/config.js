import { configure } from '@storybook/react';

function loadStories() {
  require('../test/stories/index');
  // You can require as many stories as you need.
}

configure(loadStories, module);