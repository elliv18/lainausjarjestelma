import * as bcrypt from 'bcryptjs';
import { User, UserInfo } from '../schemas/sql';
import { ROOT_ADMIN_EMAIL, ROOT_ADMIN_PASS } from '../environment';
import { logger } from './index.mjs';

export default {
  create: async () => {
    console.log('Creating admin user', ROOT_ADMIN_EMAIL);
    logger.log('info', 'CREATING ROOT ADMIN...');
    const hash = await bcrypt.hash(ROOT_ADMIN_PASS, 8);
    const user = await User.create({
      userType: 'ADMIN',
      email: ROOT_ADMIN_EMAIL,
      password: hash,
    });
    await UserInfo.create({
      name: 'Mr. Admin',
      user_id: user.id,
    });
    logger.log('info', 'CREATING ROOT ADMIN DONE');
  },
};
