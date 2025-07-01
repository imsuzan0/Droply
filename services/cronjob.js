const cron = require('cron');
const https = require('https');

const job = new cron.CronJob('*/14 * * * *', function () {
  https.get(process.env.APP_BASE_URL, (res) => {
    if (res.statusCode === 200) {
      console.log('GET request sent successfully');
    } else {
      console.log('Error sending GET request', res.statusCode);
    }
  }).on('error', (err) => {
    console.error('Error with GET request', err);
  });
});

job.start();

module.exports = job;  
