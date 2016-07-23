import React from 'react';
import { Provider } from 'react-redux';
import App from 'containers/App';

export default function createApp(store) {
  return function AppContainer() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  };
}
