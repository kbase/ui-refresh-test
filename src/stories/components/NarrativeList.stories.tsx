import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import NarrativeList, {
  NarrativeDoc,
} from '../../common/components/NarrativeList/NarrativeList';
export default {
  title: 'Components/NarrativeList',
  component: NarrativeList,
} as ComponentMeta<typeof NarrativeList>;

// Using a template allows the component to be rendered with dynamic storybook
// controls (args) these can be used to dynamically change the props of the
// component e.g. `<Component {...args} />`
const NarrativeListTemplate: ComponentStory<typeof NarrativeList> = (args) => {
  const { category, items } = args as ArgTypes;
  return (
    <Router>
      <div style={{ height: '70px', width: '100%', position: 'relative' }}>
        <NarrativeList
          category={category}
          items={items}
          loading={false}
          selected="12345/1/1"
          totalItems={1}
          pageSide={1000}
        ></NarrativeList>
      </div>
    </Router>
  );
};
interface ArgTypes {
  category: string;
  items: Array<NarrativeDoc>;
}
export const Default = NarrativeListTemplate.bind({});
Default.args = {
  category: 'own',
  items: [
    {
      access_group: 12345,
      cells: [],
      copied: false,
      creation_date: new Date().toISOString(),
      creator: 'charlie',
      data_objects: [],
      is_narratorial: false,
      is_public: false,
      is_temporary: false,
      modified_at: 0,
      narrative_title: "Charlie's Storybook Narrative",
      obj_id: 1,
      obj_name: "Charlie's Storybook Narrative",
      obj_type_module: 'KBaseCharlie.CharlieSet',
      obj_type_version: '0.0',
      owner: 'charlie',
      shared_users: ['dlyon', 'dblair'],
      tags: [],
      timestamp: 0,
      total_cells: 0,
      version: 8,
    },
    {
      access_group: 12346,
      cells: [],
      copied: false,
      creation_date: new Date().toISOString(),
      creator: 'DJKhaled',
      data_objects: [],
      is_narratorial: false,
      is_public: false,
      is_temporary: false,
      modified_at: 0,
      narrative_title: 'Another One',
      obj_id: 1,
      obj_name: 'Go buy yourself a house',
      obj_type_module: 'KBaseDJs.WeTheBest',
      obj_type_version: '1.0',
      owner: 'DJKhaled',
      shared_users: [],
      tags: [],
      timestamp: 0,
      total_cells: 0,
      version: 1,
    },
  ],
};