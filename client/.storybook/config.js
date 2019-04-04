import { configure } from '@storybook/react';

function loadStories() {
  require('../src/test/stories/index');
}

configure(loadStories, module);