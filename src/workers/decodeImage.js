import { decode } from '../lib/image';

self.onmessage = ({ data }) => {
  decode(data)
    .then(decoded => self.postMessage({ data: decoded }))
    .catch(err => self.postMessage({ error: err.message }));
};
