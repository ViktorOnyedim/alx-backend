const kue = require('kue');

// Blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

/**
 * Function to send a notification
 * @param {string} phoneNumber - The recipient's phone number
 * @param {string} message - The notification message
 * @param {Object} job - The Kue job object
 * @param {Function} done - The callback to indicate job completion or failure
 */
function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100); // Track progress as 0 out of 100

  if (blacklistedNumbers.includes(phoneNumber)) {
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  job.progress(50, 100); // Track progress to 50%
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  done(); // Indicate job is done successfully
}

// Create a queue
const queue = kue.createQueue();

// Process jobs in the "push_notification_code_2" queue with a concurrency of 2
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
