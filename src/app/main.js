import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import defaultCreateApp from 'containers/PhotomosaicApp';
import reducer from 'reducer';
import mainSaga from 'sagas';
import startWorkers from 'workers';

import 'assets/fonts/montserrat-light-webfont.woff';
import 'react-image-crop/dist/ReactCrop.css';
import 'assets/css/global.css';

const workers = startWorkers();
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(mainSaga, workers);

function render(App) {
  ReactDOM.render(
    <App />,
    document.getElementById('main')
  );
}

if (__DEV__ && module.hot) {
  module.hot.accept('./containers/PhotomosaicApp', () => {
    const createApp = require('./containers/PhotomosaicApp').default;
    render(createApp(store));
  });
}

render(defaultCreateApp(store));
