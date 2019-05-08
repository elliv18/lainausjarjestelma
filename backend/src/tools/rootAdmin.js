const bcrypt = require('bcryptjs');
const { login } = require('../schemas/sql/login');
const { ROOT_ADMIN_USERNAME, ROOT_ADMIN_PASS } = require('../environment');
// const { logger } = require('./logger');

module.exports = {
  create: () => {
    console.log('Creating admin user', ROOT_ADMIN_USERNAME);
    // logger.log('info', 'CREATING ROOT ADMIN...');
    bcrypt.hash(ROOT_ADMIN_PASS, 8).then((hash) => {
      login.create({
        username: 'admin',
        password: hash,
      });
    });
    // logger.log('info', 'CREATING ROOT ADMIN DONE');
  },
};
