import React from 'react';
import { Provider } from 'react-redux';
import App from 'components/App';

export default function createApp(store) {
  return function AppContainer() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  };
}
