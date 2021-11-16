import React from 'react';
import { render, screen } from '@testing-library/react';
import { KBaseButton } from './KBaseButton';

test('renders KBaseButton', () => {
  const onclickSpy = jest.fn();
  render(
    <ul>
      <li>
        <KBaseButton onclick={onclickSpy}>A clickable button</KBaseButton>
      </li>
      <li>
        <KBaseButton disabled={true}>A disabled button</KBaseButton>
      </li>
      <li>
        <KBaseButton disabled={true} onclick={onclickSpy}>
          Another button
        </KBaseButton>
      </li>
    </ul>
  );
  const clickable = screen.getByText(/clickable/i);
  expect(clickable).toBeInTheDocument();
  clickable.click();
  const disabled = screen.getByText(/disabled/);
  expect(disabled).toBeInTheDocument();
  expect((disabled as HTMLButtonElement).disabled).toBe(true);
  disabled.click();
  const another = screen.getByText(/another/i);
  expect(another).toBeInTheDocument();
  another.click();
  expect(onclickSpy).toHaveBeenCalledTimes(1);
});
