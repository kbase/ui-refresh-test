import { MouseEvent } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { KBaseButton } from '../../common/components';

export default {
  title: 'Components/KBaseButton',
  component: KBaseButton,
} as ComponentMeta<typeof KBaseButton>;

const randomBackground = (evt: MouseEvent<HTMLButtonElement>) => {
  console.log('Clicked!', evt); // eslint-disable-line no-console
  const randomCent = () => Math.round(100 * Math.random());
  const rr = randomCent();
  const rb = randomCent();
  const rg = randomCent();
  evt.currentTarget.style.setProperty(
    'background-color',
    `rgb(${rr}, ${rb}, ${rg})`
  );
};

const KBaseButtonTemplate: ComponentStory<typeof KBaseButton> = (args) => (
  <ul>
    <li>
      <KBaseButton>A button to click.</KBaseButton>
    </li>
    <li>
      <KBaseButton onclick={randomBackground}>
        Randomize background color.
      </KBaseButton>
    </li>
    <li>
      <KBaseButton disabled={true}>This button is disabled.</KBaseButton>
    </li>
  </ul>
);

export const Default = KBaseButtonTemplate.bind({});
Default.args = {};
