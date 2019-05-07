import { User } from '../../sql';
import { logger } from '../../../tools';

export default {
    Query: {
        currentUser: async (obj, args, { currentUser }) => {
            if (!currentUser) {
                logger.log('error', '[currentUser] Current user is not authorized');
                throw new Error('Not authorized');
            }
            const user = await User.findOne({ where: { id: currentUser.id } });
            console.log('CURRENTUSER', user);
            return user;
        },
        allUsers: async (obj, { input }, { currentUser }) => {
            if (!currentUser) {
                logger.log('error', '[allUsers] Current user is not authorized');
                throw new Error('Not authorized');
            }
            if (currentUser.type !== 'ADMIN') {
                logger.log('error', '[allUsers] Current user is not authorized');
                throw new Error('Not authorized');
            }
            const data = await User.findAll();
            return data;
        },
        allUsersByType: async (obj, { userType }, { currentUser }) => {
            if (!currentUser) {
                logger.log('error', '[allUsersByType] Current user is not authorized');
                throw new Error('Not authorized');
            }
            if (currentUser.type === 'CUSTOMER') {
                logger.log('error', '[allUsersByType] Current user is not authorized');
                throw new Error('Not authorized');
            }
            if (currentUser.type === 'COACH' && (userType === 'ADMIN' || userType === 'COACH')) {
                logger.log('error', '[allUsersByType] Current user is not authorized');
                throw new Error('Not authorized');
            }
            if (currentUser.type === 'ADMIN') {
                const type = userType;
                const user = await User.findAll({ where: { userType: type } });
                return user;
            }
            if (currentUser.userType === 'COACH') {
                const user = await User.findAll({ where: { userType: 'CUSTOMER' } });
                return user;
            }
        },
        oneUser: async (obj, { email }, { currentUser }) => {
            if (!currentUser) {
                logger.log('error', '[oneUser] Current user is not authorized');
                throw new Error('Not authorized');
            }
            if (currentUser.type === 'CUSTOMER') {
                logger.log('error', '[oneUser] Current user is not authorized');
                throw new Error('Not authorized');
            }
            const user = await User.findOne({ where: { email } });
            return user;
        },
    }
};
