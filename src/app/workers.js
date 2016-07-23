/* eslint-disable no-param-reassign,import/default */
import ResizeImageWorker from 'worker!../workers/resizeImage';
import DataURLWorker from 'worker!../workers/dataURL';
import ProcessTileWorker from 'worker!../workers/processTile';
import ProcessMainImageWorker from 'worker!../workers/processMainImage';
import MainImageForPhotomosaicWorker from 'worker!../workers/mainImageForPhotomosaic';
import ComputePhotomosaicDiffWorker from 'worker!../workers/computePhotomosaicDiff';
import ComputePhotomosaicWorker from 'worker!../workers/computePhotomosaic';

const WORKERS_CONFIG = {
  resizeImage: [ResizeImageWorker, 4],
  dataURL: [DataURLWorker, 4],
  processTile: [ProcessTileWorker, 8],
  processMainImage: [ProcessMainImageWorker, 2],
  getMainImageForPhotomosaic: [MainImageForPhotomosaicWorker, 1],
  computePhotomosaicDiff: [ComputePhotomosaicDiffWorker, 8],
  computePhotomosaic: [ComputePhotomosaicWorker, 1],
};

export function createWorkerPool(WorkerType, n) {
  const workers = [];

  while (n--) {
    workers.push(new WorkerType());
  }

  return workers;
}

export default function startWorkers() {
  const workers = Object.keys(WORKERS_CONFIG).reduce(
    (memo, key) => ({ ...memo, [key]: null }),
    {}
  );

  const pointers = Object.keys(WORKERS_CONFIG).reduce(
    (memo, key) => ({ ...memo, [key]: 0 }),
    {}
  );

  const promiseMap = new Map();

  function ensureWorkers(name) {
    if (!WORKERS_CONFIG[name]) {
      throw new Error(`No workers for ${name}.`);
    }

    if (!workers[name]) {
      const [WorkerType, numWorkers] = WORKERS_CONFIG[name];
      const workersByType = workers[name] = createWorkerPool(WorkerType, numWorkers);

      workersByType.forEach(worker => {
        promiseMap.set(worker, Promise.resolve());
      });
    }
  }

  function getWorkers(name) {
    ensureWorkers(name);
    return workers[name];
  }

  function getWorker(name) {
    ensureWorkers(name);

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
