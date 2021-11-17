import { MouseEvent } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '../../common/components';

export default {
  title: 'Components/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Colors = [
  'orange',
  'yellow',
  'green',
  'grellow',
  'blue',
  'ocean-blue',
  'teal',
  'purple',
  'frost-blue',
  'red',
  'grey',
];

const randomBackground = (evt: MouseEvent<HTMLButtonElement>) => {
  console.log('Clicked!', evt); // eslint-disable-line no-console
  const randomIndex = Math.floor(11 * Math.random());
  const randomColor = `bg-${Colors[randomIndex]}`;
  const classes = evt.currentTarget.classList;
  classes.forEach((cls) => classes.remove(cls));
  classes.add(randomColor);
};

const ButtonTemplate: ComponentStory<typeof Button> = (args) => (
  <ul>
    <li>
      <Button>A button to click.</Button>
    </li>
    <li>
      <Button onClick={randomBackground}>Randomize background color.</Button>
    </li>
    <li>
      <Button disabled={true}>This button is disabled.</Button>
    </li>
  </ul>
);

export const Default = ButtonTemplate.bind({});
Default.args = {};
