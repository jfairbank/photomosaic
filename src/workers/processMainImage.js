import { processMainImage } from '../lib/mainImage';

self.onmessage = ({ data }) => {
  const [width, height, maxSize, buffer] = data;
  const options = { width, height, maxSize };

  processMainImage(buffer, options)
    .then(mainImage => self.postMessage(mainImage));
};
