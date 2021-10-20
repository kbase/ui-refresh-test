import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

import { Provider } from 'react-redux';
import { store } from './store';

test('renders Auth page link', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const linkElement = screen.getByText(/Auth/i);
  expect(linkElement).toBeInTheDocument();
});

test('Auth page link works', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const linkElement = screen.getByText(/Auth/i);
  linkElement.click();
  const LoginStatusText = screen.getByText(/You are not logged in/i);
  expect(LoginStatusText).toBeInTheDocument();
});
