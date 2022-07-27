import DefaultIcon from './DefaultIcon';
import { render } from '@testing-library/react';

test('DefaultIcon Renders', () => {
  render(<DefaultIcon cellType="someCellType" />);
});

test('DefaultIcon Renders app icon', () => {
  const { container } = render(<DefaultIcon cellType="app" />);
  expect(container.querySelector('svg[data-icon="cube"]')).toBeInTheDocument();
});

test('DefaultIcon Renders markdown icon', () => {
  const { container } = render(<DefaultIcon cellType="markdown" />);
  expect(
    container.querySelector('svg[data-icon="paragraph"]')
  ).toBeInTheDocument();
});

test('DefaultIcon Renders data icon', () => {
  const { container } = render(<DefaultIcon cellType="data" />);
  expect(
    container.querySelector('svg[data-icon="database"]')
  ).toBeInTheDocument();
});

test('DefaultIcon Renders unspecified type icon', () => {
  const { container } = render(<DefaultIcon cellType="whatever" />);
  expect(
    container.querySelector('svg[data-icon="wrench"]')
  ).toBeInTheDocument();
});
