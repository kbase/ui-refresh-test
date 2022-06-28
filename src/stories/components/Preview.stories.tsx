import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NarrativeDoc } from '../../common/components/NarrativeList/NarrativeDoc';

import Preview from '../../common/components/Preview';

export default {
  title: 'Components/Preview',
  component: Preview,
} as ComponentMeta<typeof Preview>;

// Using a template allows the component to be rendered with dynamic storybook
// controls (args) these can be used to dynamically change the props of the
// component e.g. `<Component {...args} />`
const PreviewTemplate: ComponentStory<typeof Preview> = (args) => {
  return (
    <Router>
      <div style={{ height: '70px', width: '100%', position: 'relative' }}>
        <Preview {...args}></Preview>
      </div>
    </Router>
  );
};

const fakeNarrative: NarrativeDoc = {
  access_group: 67470,
  obj_id: 1,
  version: 6,
  cells: [],
  copied: false,
  creation_date: '54382959084',
  creator: 'me',
  data_objects: [],
  is_narratorial: true,
  is_public: true,
  is_temporary: false,
  modified_at: 3,
  narrative_title: 'dfsawd',
  obj_name: 'jim',
  obj_type_module: 'fda',
  obj_type_version: 'fdsa',
  owner: 'dad',
  shared_users: [],
  tags: [],
  timestamp: 3,
  total_cells: 3,
};

export const Default = PreviewTemplate.bind({});

Default.args = {
  narrative: fakeNarrative,
};
