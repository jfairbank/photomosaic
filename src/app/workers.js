export function workerUrl(name) {
  return `/assets/${name}.bundle.js`;
}

export function getWorker(name) {
  return new Worker(workerUrl(name));
}

export default function startWorkers() {
  return {
    decodeImage: [
      getWorker('decodeImage'),
    ],

    resizeImage: [
      getWorker('resizeImage'),
    ],
  };
}
