const { gql } = require('apollo-server');

module.exports = gql`
    #########################
    # Enums
    #########################

    enum Role {
      ADMIN
      STAFF
      STUDENTS
    }

    #########################
    # User
    #########################

    type User {
      id: ID!
      userType: Role
      email: String
      createdAt: String
      updatedAt: String
    }

    type Login {
      id: ID!
      username: String
      password: String
    }

    ###############
    # Queries
    ###############
    
    type Query {
      testMessage: String!
      listUsernames: [Login]
      # Returns the currently authenticated user, or null if unauthenticated
      currentUser: User
  
      # List all users + userInfos
      allUsers: [User]
  
      # Get one user info - filtering by email
      oneUser(email: String!): User
  
      # List all users by type
      allUsersByType: [User]
    }
`;
