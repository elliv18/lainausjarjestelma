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
        loans: [Loan]
        createdAt: String!
        updatedAt: String!
    }

    ##########
    # Device #
    ##########

    type Device {
        id: ID!
        idCode: String!
        manufacture: String
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
        deviceType: String!
        desription: String
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

        # ADMINS - List all users
        allUsers: [User]

        # ADMINS - List all categories
        allCategories: [DevCategory]

        # ADMINS/STAFF - List all devices
        allDevices: [Device]

        # ADMINS/STAFF - List all loans
        allLoans: [Loan]

        # ADMINS - List one user
        oneUser(input: OneUserInput!): OneUserPayload
    }

    #############
    # Mutations #
    #############

    type Mutation {
        ############# LOGIN #################

        # ALL - login
        login(input: LoginInput!): LoginPayload

        ############ CREATE #################

        # ADMINS - Create new user
        userCreate(input: UserCreateInput!): UserCreatePayload

        # STAFF - Create new student user
        userCreateStudent(input: UserCreateStudentInput!): UserCreateStudentPayload

        # ADMINS - Create new device category
        categoryCreate(input: CategoryCreateInput!): CategoryCreatePayload

        # ADMINS/STAFF - Create new device
        deviceCreate(input: DeviceCreateInput!): DeviceCreatePayload

        # ADMINS/STUFF - Create new loan
        loanCreate(input: LoanCreateInput!): LoanCreatePayload

        ############# UPDATE ##################

        # ADMINS - Update user
        userUpdate(input: UserUpdateInput!): UserUpdatePayload

        categoryUpdate(input: CategoryUpdateInput!): CategoryUpdatePayload
    }

    ##############################
    # Query inputs & payloads #
    ##############################

    ############### USER ######################

    input OneUserInput {
        email: String!
    }
    type OneUserPayload {
        user: User
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

    ############### USER ######################

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

    input UserUpdateInput {
        isActive: Boolean
        userType: UserType
        email: String!
        password: String
        firstName: String
        lastName: String
        address: String
        personNumber: String
        phone: String
    }
    type UserUpdatePayload {
        user: User
    }

    input UserCreateStudentInput {
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

    ########### CATEGORY #####################

    input CategoryCreateInput {
        deviceType: String!
        desription: String
    }
    type CategoryCreatePayload {
        devCategory: DevCategory
    }

    input CategoryUpdateInput {
        deviceType: String!
        desription: String
    }
    type CategoryUpdatePayload {
        devCategory: DevCategory
    }

    ############# DEVICE ##################

    input DeviceCreateInput {
        idCode: String!
        manufacture: String
        model: String
        info: String
        devType: String!
    }
    type DeviceCreatePayload {
        device: Device
    }

    ################ LOAN #######################

    input LoanCreateInput {
        loandate: String!
        dueDate: String!
        devIdCode: String!
        loaner: String!
    }
    type LoanCreatePayload {
        loan: Loan
    }
`;
