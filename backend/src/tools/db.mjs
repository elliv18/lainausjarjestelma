import { User } from '../schemas/sql';
import { sequelize } from '../../models';
import { logger, rootAdmin } from './index.mjs';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  wait: async () => {
    logger.log('info', 'Is DB ready?');
    for (;;) {
      try {
        await sequelize.authenticate();
        break;
      } catch (error) {
        logger.log('info', 'DB not ready, retrying in 1 sec..');
        await sleep(1000);
      }
    }
  },
  start: async () => {
    logger.log('info', 'Synronising database...');
    sequelize.sync();

    if (await User.count() < 1) {
      rootAdmin.create();
    }
  },
  reset: async () => {
    logger.log('info', 'RESETING DATABASE...');
    await sequelize.sync({ force: true });
    rootAdmin.create();
  },
};
