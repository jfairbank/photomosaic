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
    // decodeImage: createWorkerPool('decodeImage', 4),
    resizeImage: createWorkerPool('resizeImage', 4),
    dataURL: createWorkerPool('dataURL', 4),
    processTile: createWorkerPool('processTile', 4),
    processMainImage: createWorkerPool('processMainImage', 2),
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

  function assertWorkers(name) {
    if (!workers[name]) {
      throw new Error(`No workers for ${name}.`);
    }
  }

  function getWorkers(name) {
    assertWorkers(name);
    return workers[name];
  }

  function getWorker(name) {
    assertWorkers(name);

    const numWorkers = workers[name].length;
    const pointer = pointers[name];

    pointers[name] = (pointers[name] + 1) % numWorkers;

    return workers[name][pointer];
  }

  function runTask(name, message) {
    const worker = getWorker(name);
    const promise = promiseMap.get(worker);

    const newPromise = promise.then(() => new Promise(resolve => {
      const cb = (e) => {
        worker.removeEventListener('message', cb);
        resolve(e.data);
      };

      worker.addEventListener('message', cb);

      worker.postMessage(message);
    }));

    promiseMap.set(worker, newPromise);

    return newPromise;
  }

  function terminatePool(name) {
    setImmediate(() => {
      const workersByType = getWorkers(name);

      workersByType.forEach(worker => {
        // Delete promise
        promiseMap.delete(worker);

        // Terminate worker
        worker.terminate();
      });

      // Remove pointer
      pointers[name] = null;

      // Remove pool
      workers[name] = null;
    });
  }

  return { getWorker, runTask, terminatePool };
}
