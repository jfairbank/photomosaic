import { processMainImage } from '../lib/mainImage';

self.onmessage = ({ data }) => {
  const [maxSize, buffer] = data;

  processMainImage(buffer, maxSize)
    .then(mainImage => self.postMessage(mainImage));
};
