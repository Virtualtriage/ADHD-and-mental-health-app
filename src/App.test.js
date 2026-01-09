import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ADHD and Mental Health page', () => {
  render(<App />);
  const pageTitle = screen.getByText(/ADHD Assessment & Mental Health Services UK/i);
  expect(pageTitle).toBeInTheDocument();
});