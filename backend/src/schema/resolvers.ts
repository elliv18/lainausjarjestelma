import { prisma } from '../generated/prisma-client'

export default {
    Query: {

    },
    Mutation: {
        login: async (obj, { input: { email, password }}) => {
            const user = await prisma.user({ email: email})
            console.log(user)
        },
        createUser: async () => {

        },
        updateUser: async () => {

        },
        deleteUser: async () => {

        }
    }
}