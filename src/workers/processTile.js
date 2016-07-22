import { processTile } from '../lib/tile';

self.onmessage = ({ data }) => {
  const [tileDimension, buffer] = data;

  processTile(buffer, tileDimension)
    .then(tile => self.postMessage({ data: tile }))
    .catch(err => self.postMessage({ error: err.message }));
};
