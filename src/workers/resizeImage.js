import { resize } from '../lib/image';

self.onmessage = ({ data }) => {
  const [
    width,
    height,
    newWidth,
    newHeight,
    channels,
    interpolationPass,
    buffer,
  ] = data;

  const resizedBuffer = resize(buffer, {
    width,
    height,
    newWidth,
    newHeight,
    channels,
    interpolationPass,
  });

  self.postMessage(resizedBuffer);
};
