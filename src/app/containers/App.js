import React from 'react';
import { Provider } from 'react-redux';
import Flow from './Flow';

export default function createApp(store) {
  return function App() {
    return (
      <Provider store={store}>
        <Flow />
      </Provider>
    );
  };
}
