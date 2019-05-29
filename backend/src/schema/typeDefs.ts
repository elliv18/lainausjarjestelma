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
        category: Category!
        createdAt: String!
        updatedAt: String!
    }

    ###############
    # DevCategory #
    ###############

    type Category {
        id: ID!
        deviceCategory: String!
        desription: String
        createdAt: String!
        updatedAt: String!
    }

    ########
    # Loan #
    ########

    type Loan {
        id: ID!
        isActive: String!
        loanDate: String!
        returnDate: String
        dueDate: String!
        device: Device!
        loaner: User!
        supplier: User!
        returner: User
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
        allCategories: [Category]

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
        ############# CURRENTUSER #################

        # CURRENTUSER - Update personal information
        currentUserUpdate(input: currentUserUpdateInput): currentUserUpdatePayload

        ############# LOGIN #################

        # ALL - login
        login(input: LoginInput!): LoginPayload

        ############ CREATE #################

        # ADMINS/STAFF - Create new user
        userCreate(input: UserCreateInput!): UserCreatePayload

        # ADMINS - Create new device category
        categoryCreate(input: CategoryCreateInput!): CategoryCreatePayload

        # ADMINS/STAFF - Create new device
        deviceCreate(input: DeviceCreateInput!): DeviceCreatePayload

        # ADMINS/STUFF - Create new loan
        loanCreate(input: LoanCreateInput!): LoanCreatePayload

        ############# UPDATE ##################

        # ADMINS - Update user
        userUpdate(input: UserUpdateInput!): UserUpdatePayload

        # ADMINS - Update password
        userUpdatePW(input: UserUpdatePWInput!): UserUpdatePWPayload

        # ADMINS - Update device category
        categoryUpdate(input: CategoryUpdateInput!): CategoryUpdatePayload

        # Update device
        deviceUpdate(input: DeviceUpdateInput!): DeviceUpdatePayload

        ########## RETURN LOAN ######################

        # Return loan
        loanReturn(input: LoanReturnInput!): LoanReturnPayload

        ############## DELETE ###############

        # ADMINS - Delete user
        userDelete(input: UserDeleteInput!): UserDeletePayload

        # ADMINS - Delete device category
        categoryDelete(input: CategoryDeleteInput!): CategoryDeletePayload

        # ADMINS - Delete device
        deviceDelete(input: DeviceDeleteInput!): DeviceDeletePayload

        # ADMINS - Delete loan
        loanDelete(input: LoanDeleteInput!): LoanDeletePayload
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

    ############### CURRENTUSER ####################

    input currentUserUpdateInput {
        firstName: String
        lastName: String
        address: String
        phone: String
        password: String
        oldPassword: String
    }
    type currentUserUpdatePayload {
        user: User
    }

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
        userType: String!
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
        id: ID!
        isActive: Boolean
        userType: String
        email: String
        firstName: String
        lastName: String
        address: String
        personNumber: String
        phone: String
    }
    type UserUpdatePayload {
        user: User
    }

    input UserDeleteInput {
        id: ID!
    }
    type UserDeletePayload {
        user: User
    }

    input UserUpdatePWInput {
        id: ID!
        password: String!
    }
    type UserUpdatePWPayload {
        user: User
    }

    ########### CATEGORY #####################

    input CategoryCreateInput {
        deviceCategory: String!
        desription: String
    }
    type CategoryCreatePayload {
        category: Category
    }

    input CategoryUpdateInput {
        deviceCategory: String!
        desription: String
    }
    type CategoryUpdatePayload {
        category: Category
    }

    input CategoryDeleteInput {
        id: ID!
    }
    type CategoryDeletePayload {
        category: Category
    }

    ############# DEVICE ##################

    input DeviceCreateInput {
        idCode: String!
        manufacture: String
        model: String
        info: String
        deviceCategory: String!
    }
    type DeviceCreatePayload {
        device: Device
    }

    input DeviceUpdateInput {
        idCode: String!
        manufacture: String
        model: String
        info: String
        deviceCategory: String
    }
    type DeviceUpdatePayload {
        device: Device
    }

    input DeviceDeleteInput {
        id: ID!
    }
    type DeviceDeletePayload {
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

    input LoanReturnInput {
        idCode: String!
        returnDate: String
    }
    type LoanReturnPayload {
        loan: Loan
    }

    input LoanDeleteInput {
        id: ID!
    }
    type LoanDeletePayload {
        loan: Loan
    }
`;
