import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from './Styles';
import { ThemeProvider } from 'styled-components';
import { initialTheme } from './theme';
import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={initialTheme}>
        <App />
        <GlobalStyles />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
