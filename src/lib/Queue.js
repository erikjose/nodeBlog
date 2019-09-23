import Bee from 'bee-queue';
import NewUser from '../app/jobs/NewUser';
import configRedis from '../config/redis';

const jobs = [NewUser];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        queue: new Bee(key, {
          redis: configRedis,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].queue.createJob(job).save();
  }

  processQueue() {
    jobs.forEach((job) => {
      const { queue, handle } = this.queues[job.key];

      queue.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
