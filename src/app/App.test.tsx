import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

import { Provider } from 'react-redux';
import { createTestStore } from './store';

test('renders Auth page link', () => {
  render(
    <Provider store={createTestStore()}>
      <App />
    </Provider>
  );
  const linkElement = screen.getByText(/Auth/i);
  expect(linkElement).toBeInTheDocument();
});

test('Auth page link works', () => {
  render(
    <Provider store={createTestStore()}>
      <App />
    </Provider>
  );
  const linkElement = screen.getByText(/Auth/i);
  linkElement.click();
  const LoginStatusText = screen.getByText(/kbase_session/);
  expect(LoginStatusText).toBeInTheDocument();
});
