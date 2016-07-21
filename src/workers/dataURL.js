import inkjet from 'inkjet';
import StringView from '../app/stringview';

let options = null;

self.onmessage = ({ data }) => {
  if (data[0] === 'setup') {
    const [, width, height, quality] = data;
    options = { width, height, quality };
    self.postMessage({ ready: true });
  } else if (data[0] === 'toDataURL') {
    const buffer = data[1];

    inkjet.encode(buffer, options, (error, encoded) => {
      if (error) {
        self.postMessage({ error: error.message });
      } else {
        const sv = new StringView(encoded.data);
        const b64 = sv.toBase64();
        const dataURL = `data:image/jpeg;base64,${b64}`;

        self.postMessage({ data: dataURL });
      }
    });
  }
};
