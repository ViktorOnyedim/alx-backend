const { expect } = require('chai');
const kue = require('kue');
const createPushNotificationsJobs = require('./8-job');

describe('createPushNotificationsJobs', function () {
  let queue;

  // Setup and teardown for the queue
  beforeEach(() => {
    queue = kue.createQueue();
    queue.testMode.enter(); // Enter test mode
  });

  afterEach(() => {
    queue.testMode.clear(); // Clear the queue after each test
    queue.testMode.exit();  // Exit test mode
  });

  it('should throw an error if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs('not-an-array', queue)).to.throw('Jobs is not an array');
    expect(() => createPushNotificationsJobs({}, queue)).to.throw('Jobs is not an array');
    expect(() => createPushNotificationsJobs(null, queue)).to.throw('Jobs is not an array');
  });

  it('should create jobs for each item in the jobs array', () => {
    const jobs = [
      { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
      { phoneNumber: '4153518781', message: 'This is the code 4562 to verify your account' },
    ];

    createPushNotificationsJobs(jobs, queue);

    // Check if the jobs are added to the queue
    expect(queue.testMode.jobs.length).to.equal(jobs.length);

    // Validate each job data
    jobs.forEach((job, index) => {
      expect(queue.testMode.jobs[index].type).to.equal('push_notification_code_3');
      expect(queue.testMode.jobs[index].data).to.deep.equal(job);
    });
  });

  it('should log appropriate messages for job events', (done) => {
    const jobs = [
      { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
    ];

    // Mock console.log
    const logs = [];
    const originalLog = console.log;
    console.log = (message) => logs.push(message);

    createPushNotificationsJobs(jobs, queue);

    // Simulate job events
    const job = queue.testMode.jobs[0];
    job.emit('enqueue');
    job.emit('complete');
    job.emit('failed', 'Some error occurred');
    job.emit('progress', 50);

    // Restore console.log
    console.log = originalLog;

    // Assertions for logged messages
    setTimeout(() => {
      expect(logs).to.include(`Notification job created: ${job.id}`);
      expect(logs).to.include(`Notification job ${job.id} completed`);
      expect(logs).to.include(`Notification job ${job.id} failed: Some error occurred`);
      expect(logs).to.include(`Notification job ${job.id} 50% complete`);
      done();
    }, 100);
  });

  it('should handle an empty jobs array gracefully', () => {
    createPushNotificationsJobs([], queue);

    // Check that no jobs were added to the queue
    expect(queue.testMode.jobs.length).to.equal(0);
  });
});
