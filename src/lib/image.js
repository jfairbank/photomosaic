import nj from 'numjs';
import inkjet from 'inkjet';
import pica from 'pica';
import PNGReader from 'png.js';
// import Resizer from './resizer';
import StringView from './stringview';

export function isImageType(header) {
  const headerLen = header.length;

  return (buffer) => {
    const view = new Uint8Array(buffer);

    for (let i = 0; i < headerLen; i++) {
      if (view[i] !== header[i]) {
        return false;
      }
    }

    return true;
  };
}

export const isJPG = isImageType([0xff, 0xd8, 0xff]);
export const isPNG = isImageType([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

export function normalizePNGOutput(png) {
  const width = png.getWidth();
  const height = png.getHeight();
  const data = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      data.push(...png.getPixel(x, y));
    }
  }

  return { data, width, height };
}

export function decode(buffer) {
  if (isJPG(buffer)) {
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

  if (isPNG(buffer)) {
    return new Promise((resolve, reject) => {
      const reader = new PNGReader(buffer);

      reader.parse((err, png) => {
        if (err) {
          reject(err);
        } else {
          resolve(normalizePNGOutput(png));
        }
      });
    });
  }

  return Promise.reject(new Error('Unsupported image type.'));
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
