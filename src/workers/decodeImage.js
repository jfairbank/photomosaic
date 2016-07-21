import inkjet from 'inkjet';

self.onmessage = ({ data }) => {
  inkjet.decode(data, (err, decoded) => {
    self.postMessage(decoded);
  });
};
