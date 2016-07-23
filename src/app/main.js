import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore, compose } from 'redux';
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
  module.hot.accept('./containers/PhotomosaicApp', () => {
    const createApp = require('./containers/PhotomosaicApp').default;
    render(createApp(store));
  });
}

render(defaultCreateApp(store));
