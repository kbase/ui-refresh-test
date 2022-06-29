import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Preview } from '../../common/components/Preview';

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
        <Preview {...args} />
      </div>
    </Router>
  );
};
export const Default = PreviewTemplate.bind({});

Default.args = {
  maxLength: 16,
  wsId: 424242,
  cells: [
    {
      metaName: 'an app cell',
      cellType: 'app',
      title: 'an incredible app!',
      subtitle: 'It makes the PIs weep with joy.',
      tag: 'release',
    },
    {
      metaName: 'KBaseGenomes.Genome-1.1',
      cellType: 'data',
      title: 'The entire Genome of Sigourney Weaver',
      subtitle: 'Top secret!! do not share outside of this org.',
      tag: 'beta',
    },
    {
      metaName: 'KBaseSamples.Sample',
      cellType: 'data',
      title: 'Xenomorph Gut Microbiome',
      subtitle: 'Sampled by Weyland-Yutani © 2122',
      tag: 'dev',
    },
  ],
};
