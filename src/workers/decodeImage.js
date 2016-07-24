import { decode } from '../lib/image';

self.onmessage = ({ data }) => {
  decode(data)
    .then(result => self.postMessage({
      data: {
        buffer: result.data,
        width: result.width,
        height: result.height,
      },
    }))
    .catch(err => self.postMessage({ error: err.message }));
};
