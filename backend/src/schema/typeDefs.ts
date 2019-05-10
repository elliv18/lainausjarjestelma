export default `
    enum UserType {
        ADMIN
        STAFF
        STUDENT
    }

    type User {
        id: ID!
        isActive: Boolean
        userType: UserType
        email: String
        password: String
    }

    type Device {

    }

    type DevCategory {

    }

    type Loan {
        
    }

    type Query {

    }

    type Mutation {

    }
`

