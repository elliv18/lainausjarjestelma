import { prisma } from '../generated/prisma-client'
import * as bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../environment'

export default {
    Query: {

    },
    Mutation: {
        login: async (obj, { input: { email, password }}) => {
            const user = await prisma.user({ email: email})
            console.log(user)
            if (!user) {
                throw new Error('Email not found!')
            }

            const pwValid = await bcrypt.compare(password, user.password)

            if (!pwValid) {
                throw new Error('Password is invalid!')
            }

            const jwt = sign({ id: user.id, type: user.userType }, JWT_SECRET)

            return { jwt }
        }
    }
}