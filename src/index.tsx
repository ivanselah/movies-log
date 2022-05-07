import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from './Styles';
import { ThemeProvider } from 'styled-components';
import { initialTheme } from './theme';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={initialTheme}>
      <App />
      <GlobalStyles />
    </ThemeProvider>
  </React.StrictMode>
);
