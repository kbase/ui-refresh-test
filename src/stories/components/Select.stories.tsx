import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';

import { Select, SelectOption } from '../../common/components/Select';

export default {
  title: 'Components/Select',
  component: Select,
} as ComponentMeta<typeof Select>;

const SelectTemplate: ComponentStory<typeof Select> = (args) => {
  const [value, setValue] = useState<SelectOption[] | undefined>();
  const handleChange = (selected: SelectOption[]) => {
    setValue(selected);
  };
  const options: SelectOption[] = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry', icon: '🍓' },
    { value: 'vanilla', label: 'Vanilla' },
  ];
  return (
    <Select {...args} value={value} options={options} onChange={handleChange} />
  );
};

export const Default = SelectTemplate.bind({});
Default.args = {
  disabled: false,
  clearable: true,
  multiple: false,
};

const SelectAsyncTemplate: ComponentStory<typeof Select> = (args) => {
  const [value, setValue] = useState<SelectOption[] | undefined>();
  const handleChange = (selected: SelectOption[]) => {
    setValue(selected);
  };
  return (
    <Select
      {...args}
      value={value}
      onChange={handleChange}
      options={async (inputValue) => {
        return new Promise((resolve) => {
          setTimeout(
            () =>
              resolve([
                { value: 'chocolate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilla', label: 'Vanilla' },
                { value: inputValue, label: `Some Option(s) ${inputValue}` },
              ]),
            500
          );
        });
      }}
    />
  );
};

export const Async = SelectAsyncTemplate.bind({});
Async.args = {
  disabled: false,
  clearable: true,
  multiple: false,
};
