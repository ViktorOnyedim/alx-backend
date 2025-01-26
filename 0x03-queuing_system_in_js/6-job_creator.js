const kue = require('kue');

// Create a queue
const queue = kue.createQueue();

// Define job data
const jobData = {
  phoneNumber: '123-456-7890',
  message: 'Hello, this is a notification message!',
};

// Create a job in the queue
const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (!err) {
      console.log(`Notification job created: ${job.id}`);
    } else {
      console.log(`Failed to create notification job: ${err.message}`);
    }
  });

// Handle job events
job.on('complete', () => {
  console.log('Notification job completed');
});

job.on('failed', (errorMessage) => {
  console.log(`Notification job failed: ${errorMessage}`);
});
