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
        createdAt: DateTime!
        updatedAt: DateTime!

    }

    ##########
    # Device #
    ##########

    type Device {
        id: ID!
        idCode: String!
        model: String
        info: String
        devCategory: DevCategory!
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    ###############
    # DevCategory #
    ###############

    type DevCategory {
        id: ID!
        deviceType: String
        manufacture: String
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    ########
    # Loan #
    ########

    type Loan {
        id: ID!
        loandate: Datetime!
        returnDate: DateTime
        dueDate: DateTime!
        deviceId: Device!
        loanerId: User!
        supplierId: User!
        returnerId: User
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    ###########
    # Queries #
    ###########

    type Query {
        currentUser: User
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

