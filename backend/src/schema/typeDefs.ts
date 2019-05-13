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
        # ALL - return current user information
        currentUser: User

        # ALL - login
        login(input: LoginInput!): LoginPayload

        # ADMINS - List all users
        allUsers: [User]
    }

    #############
    # Mutations #
    #############

    type Mutation {
        # ADMINS - Create new user
        userCreate(input: UserCreateInput!): UserCreatePayload

        # STAFF - Create new student user
        userCreateStudent(input: UserCreateStudentInput!): UserCreateStudentPayload

        # ADMINS - Create new Device Category
        categoryCreate(input: CategoryCreateInput!): CategoryCreatePayload
    }

    ##############################
    # Query inputs & payloads #
    ##############################

    ################# LOGIN ########################

    input LoginInput {
        email: String!  
        password: String!
    }
    type LoginPayload {
        jwt: String
    }

    ##############################
    # Mutation inputs & payloads #
    ##############################

    input UserCreateInput {
        isActive: Boolean!
        userType: UserType!
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        address: String
        personNumber: String
        phone: String!
    }
    type UserCreatePayload {
        user: User
    }

    input UserCreateStudentInput {
        isActive: Boolean!
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        address: String
        personNumber: String
        phone: String!
    }
    type UserCreateStudentPayload {
        user: User
    }

    input CategoryCreateInput {
        deviceType: String!
        manufacture: String
    }
    type CategoryCreatePayload {
        devCategory: DevCategory
    }
`;
