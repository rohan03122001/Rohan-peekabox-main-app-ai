const cron = require('node-cron');
const { moveDeletedBrandsToArchive } = require('./brandArchive.util');
const { moveDeletedStoresToArchive } = require('./storeArchive.util');

const runBrandArchiveCronJob = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running brand archive job...');
    const result = await moveDeletedBrandsToArchive();
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  });
};

const runStoreArchiveCronJob = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running store archive job...');
    const result = await moveDeletedStoresToArchive();
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  });
};

module.exports = {
  runBrandArchiveCronJob,
  runStoreArchiveCronJob,
};
