export default `
    #########
    # Enums #
    #########

    enum UserType {
        ADMIN
        STAFF
        STUDENT
    }

    ########
    # User #
    ########

    type User {
        id: ID!
        isActive: Boolean
        userType: UserType
        email: String
        password: String!
        firstName: String
        lastName: String
        address: String
        personNumber: String
        phone: String
        createdAt: String!
        updatedAt: String!

    }

    ##########
    # Device #
    ##########

    type Device {
        id: ID!
        idCode: String!
        model: String
        info: String
        loanStatus: Boolean!
        devCategory: DevCategory!
        createdAt: String!
        updatedAt: String!
    }

    ###############
    # DevCategory #
    ###############

    type DevCategory {
        id: ID!
        deviceType: String
        manufacture: String
        createdAt: String!
        updatedAt: String!
    }

    ########
    # Loan #
    ########

    type Loan {
        id: ID!
        loandate: String!
        returnDate: String
        dueDate: String!
        deviceId: Device!
        loanerId: User!
        supplierId: User!
        returnerId: User
        createdAt: String!
        updatedAt: String!
    }

    ###########
    # Queries #
    ###########

    type Query {
        currentUser: User
        allUsers: [User]
    }

    #############
    # Mutations #
    #############

    type Mutation {
        # ALL -login
        login(input: LoginInput!): LoginPayload
    }

    ##############################
    # Mutation inputs & payloads #
    ##############################

    ################# LOGIN ########################

    input LoginInput {
        email: String!
        password: String!
    }
    type LoginPayload {
        jwt: String
    }
`

