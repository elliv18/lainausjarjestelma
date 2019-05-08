const login = require('../schemas/sql/login');
const models = require('../../models');
// const { logger } = require('./logger');
const rootAdmin = require('./rootAdmin');

/* function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
} */

module.exports = {
  wait: () => {
    console.log('waiting db...');
    models.sequelize.authenticate().then(() => {
      console.log('Connection established successfully.');
    }).catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
  },
  start: () => {
    console.log('starting db...');
    // logger.log('info', 'Synronising database...');
    models.sequelize.sync().then(() => {
      rootAdmin.create();
      /* login.count().then((result) => {
        console.log(result);
        /* if (count < 1) {
          rootAdmin.create();
        } */
    });
  },
  reset: () => {
    // logger.log('info', 'RESETING DATABASE...');
    models.sequelize.sync({ force: true }).then(() => {
      rootAdmin.create();
    });
  },
};
