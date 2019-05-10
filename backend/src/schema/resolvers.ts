import { prisma } from '../generated/prisma-client'
import * as bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../environment'

export default {
    Query: {
        currentUser: async (obj, args, req) => {
            return await prisma.user({ id: req.id })
        },
        allUsers: async (obj, args, reg) => {
            return await prisma.users
        }
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