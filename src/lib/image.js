import nj from 'numjs';
import inkjet from 'inkjet';
import pica from 'pica';
// import Resizer from './resizer';
import StringView from './stringview';

export function decode(buffer) {
  return new Promise((resolve, reject) => {
    inkjet.decode(buffer, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

export function encode(buffer, options) {
  return new Promise((resolve, reject) => {
    inkjet.encode(buffer, options, (err, encoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(encoded);
      }
    });
  });
}

export function resize(buffer, { width, height, newWidth, newHeight }) {
  const options = {
    width,
    height,
    toWidth: newWidth,
    toHeight: newHeight,
    src: buffer,
  };

  let resizedBuffer;

  // This call is actually synchronous, so just set the resizedBuffer with the
  // callback param.
  pica.resizeBuffer(options, (_, dest) => {
    resizedBuffer = dest;
  });

  return resizedBuffer;
}

// export function resize(buffer, {
//   width,
//   height,
//   newWidth,
//   newHeight,
//   channels = 4,
//   interpolationPass = true,
// }) {
//   const resizer = new Resizer(
//     width,
//     height,
//     newWidth,
//     newHeight,
//     channels,
//     interpolationPass
//   );

//   return resizer.resize(buffer);
// }

export function getImageArray(buffer, width, height) {
  return nj.uint8(buffer).reshape(height, width, 4);
}

export function crop(buffer, { width, height, x, y, newWidth, newHeight }) {
  const croppedArray = getImageArray(buffer, width, height)
    .slice([y, y + newHeight], [x, x + newWidth])
    .flatten()
    .tolist();

  return new Uint8Array(croppedArray);
}

export function cropFromCenter(buffer, { width, height, newWidth, newHeight }) {
  if (newWidth > width) {
    throw new Error('New width larger than original width.');
  }

  if (newHeight > height) {
    throw new Error('New height larger than original height.');
  }

  const x = Math.floor((width - newWidth) / 2);
  const y = Math.floor((height - newHeight) / 2);

  return crop(buffer, { width, height, x, y, newWidth, newHeight });
}

export function cropSquareFromCenter(buffer, width, height) {
  const dimension = Math.min(width, height);

  const croppedBuffer = cropFromCenter(buffer, {
    width,
    height,
    newWidth: dimension,
    newHeight: dimension,
  });

  return {
    dimension,
    buffer: croppedBuffer,
  };
}

export function computeDataURL(
  buffer,
  { width, height, quality = 100 }
) {
  return encode(buffer, { width, height, quality }).then(encoded => {
    const sv = new StringView(encoded.data);
    const b64 = sv.toBase64();

    return `data:image/jpeg;base64,${b64}`;
  });
}
