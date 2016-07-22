import { computeDataURL } from '../lib/image';

self.onmessage = ({ data }) => {
  const [width, height, quality, buffer] = data;
  const options = { width, height, quality };

  computeDataURL(buffer, options)
    .then(dataURL => self.postMessage({ data: dataURL }))
    .catch(err => self.postMessage({ error: err.message }));
};
