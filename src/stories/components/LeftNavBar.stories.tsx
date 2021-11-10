import { ComponentStory, ComponentMeta } from '@storybook/react';

import LeftNavBar from '../../features/layout/LeftNavBar';

export default {
  title: 'Components/LeftNavBar',
  component: LeftNavBar,
} as ComponentMeta<typeof LeftNavBar>;

// Using a template allows the component to be rendered with dynamic storybook
// controls (args) these can be used to dynamically change the props of the
// component e.g. `<Component {...args} />`
const LeftNavBarTemplate: ComponentStory<typeof LeftNavBar> = (args) => (
  <div style={{ width: '75px', position: 'relative' }}>
    <LeftNavBar />
  </div>
);

// Each story for the component can then reuse the template, setting props with
// the "args" attribute
export const Default = LeftNavBarTemplate.bind({});
Default.args = {};
