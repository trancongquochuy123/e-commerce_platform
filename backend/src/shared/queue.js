// src/shared/queue.js
const Queue = require('bull');
const logger = require('./logger');

const emailQueue = new Queue('email', {
    redis: { url: process.env.REDIS_URL || 'redis://127.0.0.1:6379' }
});

// process job
emailQueue.process(async (job) => {
    logger.info(`Processing job ${job.id} - ${job.name}`);
    const { to, subject, content } = job.data;
    // Gọi hàm gửi mail (sendMail.js)
    // await sendMail(to, subject, content);
});

// add job
const addEmailJob = async (data) => {
    await emailQueue.add('sendEmail', data, { attempts: 3, backoff: 5000 });
};

module.exports = { emailQueue, addEmailJob };
