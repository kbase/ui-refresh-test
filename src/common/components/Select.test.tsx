import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

test('Select Renders', () => {
  const { container } = render(
    <Select
      options={[
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
      ]}
    />
  );
  const selectControl = container.querySelector('.react-select__control');
  expect(selectControl).toBeInTheDocument();
});

test('Single select onchange', async () => {
  const onChange = jest.fn();
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];
  const { container } = render(
    <Select onChange={onChange} options={options} />
  );
  const selectControl = container.querySelector('.react-select__control');
  expect(selectControl).toBeInTheDocument();

  selectControl && userEvent.click(selectControl);
  const opt = await screen.findByText('Chocolate');
  opt && userEvent.click(opt);
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([options[0]]));

  selectControl && userEvent.click(selectControl);
  const opt2 = await screen.findByText('Vanilla');
  opt2 && userEvent.click(opt2);
  expect(onChange).toHaveBeenCalledTimes(2);
  expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([options[2]]));
  expect(onChange).toHaveBeenCalledWith(
    expect.not.arrayContaining([options[0]])
  );
});

test('Multi select onchange and remove', async () => {
  const onChange = jest.fn();
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];
  const { container } = render(
    <Select multiple onChange={onChange} options={options} />
  );
  const selectControl = container.querySelector('.react-select__control');
  expect(selectControl).toBeInTheDocument();

  selectControl && userEvent.click(selectControl);
  const opt = await screen.findByText('Chocolate');
  opt && userEvent.click(opt);
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([options[0]]));

  selectControl && userEvent.click(selectControl);
  const opt2 = await screen.findByText('Vanilla');
  opt2 && userEvent.click(opt2);
  expect(onChange).toHaveBeenCalledTimes(2);
  expect(onChange).toHaveBeenCalledWith(
    expect.arrayContaining([options[2], options[0]])
  );

  selectControl && userEvent.click(selectControl);
  const remove = (await screen.findByText('Chocolate'))
    ?.closest('.react-select__multi-value')
    ?.querySelector('.react-select__multi-value__remove');
  remove && userEvent.click(remove);
  expect(onChange).toHaveBeenCalledTimes(3);
  expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([options[2]]));
  expect(onChange).toHaveBeenCalledWith(
    expect.not.arrayContaining([options[0]])
  );
});

test('Async option loading and selection', async () => {
  const onChange = jest.fn();
  const options = async (inputValue: string) => {
    await new Promise((r) => setTimeout(r, 100));
    return [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' },
      { value: 'test-value', label: inputValue },
    ];
  };
  const optionsSpy = jest.fn(options);
  const { container } = render(
    <Select onChange={onChange} options={optionsSpy} />
  );
  const selectControl = container.querySelector('.react-select__control');
  expect(selectControl).toBeInTheDocument();
  await waitFor(async () => {
    // initial options load
    expect(optionsSpy).toHaveBeenCalledTimes(1);
    await optionsSpy.mock.results[0].value;
  });

  const input = container.querySelector('input');
  const testText = 'foobar';
  userEvent.type(input as HTMLInputElement, testText);
  await waitFor(async () => {
    // wait for new options to load
    expect(optionsSpy).toHaveBeenCalledTimes(1 + testText.length);
    await optionsSpy.mock.results[testText.length].value;
  });
  const opt = await screen.findByText(testText);
  expect(opt).toBeInTheDocument();
  opt && userEvent.click(opt);
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(
    expect.arrayContaining([{ value: 'test-value', label: testText }])
  );
});
