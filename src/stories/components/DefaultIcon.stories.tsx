import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import DefaultIcon from '../../common/components/DefaultIcon';

export default {
  title: 'Components/DefaultIcon',
  component: DefaultIcon,
} as ComponentMeta<typeof DefaultIcon>;

// Using a template allows the component to be rendered with dynamic storybook
// controls (args) these can be used to dynamically change the props of the
// component e.g. `<Component {...args} />`
const DefaultIconTemplate: ComponentStory<typeof DefaultIcon> = (args) => {
  return (
    <Router>
      <div style={{ height: '70px', width: '100%', position: 'relative' }}>
        <DefaultIcon {...args} />
      </div>
    </Router>
  );
};

export const Default = DefaultIconTemplate.bind({});

Default.args = {
  cellType: 'app',
};
