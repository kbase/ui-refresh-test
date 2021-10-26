import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Nav from '../../common/Nav';

export default {
  title: 'Components/Nav',
  component: Nav,
} as ComponentMeta<typeof Nav>;

// Using a template allows the component to be rendered with dynamic storybook
// controls (args) these can be used to dynamically change the props of the
// component e.g. `<Component {...args} />`
const NavTemplate: ComponentStory<typeof Nav> = (args) => (
  <Router>
    <Nav />
  </Router>
);

// Each story for the component can then reuse the template, setting props with
// the "args" attribute
export const Default = NavTemplate.bind({});
Default.args = {};
