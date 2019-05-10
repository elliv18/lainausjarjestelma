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
        password: String
    }

    ##########
    # Device #
    ##########

    type Device {

    }

    ###############
    # DevCategory #
    ###############

    type DevCategory {

    }

    ########
    # Loan #
    ########

    type Loan {

    }

    ###########
    # Queries #
    ###########

    type Query {

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

