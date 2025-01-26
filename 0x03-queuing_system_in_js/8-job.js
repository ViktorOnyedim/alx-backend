const kue = require('kue');

/**
 * Create push notifications jobs and add them to a queue
 * @param {Array} jobs - An array of job objects containing phoneNumber and message
 * @param {Object} queue - The Kue queue instance
 */
function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  jobs.forEach((jobData) => {
    const job = queue.create('push_notification_code_3', jobData);

    // Log when the job is created
    job.on('enqueue', () => {
      console.log(`Notification job created: ${job.id}`);
    });

    // Log when the job is complete
    job.on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    });

    // Log when the job fails
    job.on('failed', (errorMessage) => {
      console.log(`Notification job ${job.id} failed: ${errorMessage}`);
    });

    // Log when the job makes progress
    job.on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });

    // Save the job to the queue
    job.save((err) => {
      if (err) {
        console.error(`Failed to save job ${job.id}: ${err}`);
      }
    });
  });
}

module.exports = createPushNotificationsJobs;
