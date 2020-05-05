import React from 'react';
import { StoreProvider } from 'easy-peasy';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import { ReactQueryDevtools } from 'react-query-devtools';

import configureStore from './store/configureStore';
import theme from './contants/theme';
import Layout from './components/Layout';

const store = configureStore();

function App() {
  return (
    <StoreProvider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <Layout />
          <ReactQueryDevtools />
        </ThemeProvider>
      </Router>
    </StoreProvider>
  );
}

export default App;
