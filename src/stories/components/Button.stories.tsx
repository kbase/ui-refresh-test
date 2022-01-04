import { MouseEvent } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '../../common/components';
import classes from '../../common/components/Button.module.scss';

export default {
  title: 'Components/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const randomBackground = (evt: MouseEvent<HTMLButtonElement>) => {
  const classNames = Object.keys(classes);
  const randomIndex = Math.floor(classNames.length * Math.random());
  const randomClass = classes[classNames[randomIndex]];
  const currentClasses = evt.currentTarget.classList;
  currentClasses.forEach((cls) => currentClasses.remove(cls));
  currentClasses.add(randomClass);
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
