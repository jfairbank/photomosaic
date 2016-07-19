import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import defaultCreateApp from './containers/App';
import reducer from './reducer';
import mainSaga from './sagas';
import startWorkers from './workers';
import 'react-image-crop/dist/ReactCrop.css';

const workers = startWorkers();
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  compose(
    applyMiddleware(sagaMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

sagaMiddleware.run(mainSaga, workers);

function render(App) {
  ReactDOM.render(
    <App />,
    document.getElementById('main')
  );
}

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const createApp = require('./containers/App').default;
    render(createApp(store));
  });
}

render(defaultCreateApp(store));
