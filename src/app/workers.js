/* eslint-disable no-param-reassign */
export function workerUrl(name) {
  return `/assets/${name}.bundle.js`;
}

export function createWorker(name) {
  return new Worker(workerUrl(name));
}

export function createWorkerPool(name, n) {
  const workers = [];

  while (n--) {
    workers.push(createWorker(name));
  }

  return workers;
}

export default function startWorkers() {
  const workers = {
    decodeImage: createWorkerPool('decodeImage', 4),
    resizeImage: createWorkerPool('resizeImage', 4),
    dataURL: createWorkerPool('dataURL', 4),
    computePhotomosaicDiff: createWorkerPool('computePhotomosaicDiff', 4),
    computePhotomosaic: createWorkerPool('computePhotomosaic', 1),
  };

  const pointers = Object.keys(workers).reduce(
    (memo, key) => ({ ...memo, [key]: 0 }),
    {}
  );

  const promiseMap = new Map();

  Object.keys(workers).forEach(key => {
    const workersByType = workers[key];

    workersByType.forEach(worker => {
      promiseMap.set(worker, Promise.resolve());
    });
  });

  function getWorker(name) {
    const numWorkers = workers[name].length;
    const pointer = pointers[name];

    pointers[name] = (pointers[name] + 1) % numWorkers;

    return workers[name][pointer];
  }

  function runTasksSequentially(name, messages) {
    const worker = getWorker(name);
    const promise = promiseMap.get(worker);

    const newPromise = messages.reduce((memo, message) => (
      memo.then(() => new Promise(resolve => {
        const cb = (e) => {
          worker.removeEventListener('message', cb);
          resolve(e.data);
        };

        worker.addEventListener('message', cb);

        worker.postMessage(message);
      }))
    ), promise);

    promiseMap.set(worker, newPromise);

    return newPromise;
  }

  function runTask(name, message) {
    return runTasksSequentially(name, [message]);
  }

  return { getWorker, runTask, runTasksSequentially };
}
