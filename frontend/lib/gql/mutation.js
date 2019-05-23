import gql from 'graphql-tag';

export const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      jwt
    }
  }
`;
// USERS
export const USERS_ADD_MUTATION = gql`
  mutation addMutation(
    $isActive: Boolean!
    $userType: String!
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $address: String!
    $personNumber: String!
    $phone: String!
  ) {
    userCreate(
      input: {
        isActive: $isActive
        userType: $userType
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
        address: $address
        personNumber: $personNumber
        phone: $phone
      }
    ) {
      user {
        isActive
        userType
        email
        password
        firstName
        lastName
        address
        personNumber
        phone
      }
    }
  }
`;

export const USERS_UPDATE_MUTATION = gql`
  mutation updateMutation(
    $id: ID!
    $isActive: Boolean
    $userType: String
    $email: String
    $firstName: String
    $lastName: String
    $address: String
    $personNumber: String
    $phone: String
  ) {
    userUpdate(
      input: {
        id: $id
        isActive: $isActive
        userType: $userType
        email: $email
        firstName: $firstName
        lastName: $lastName
        address: $address
        personNumber: $personNumber
        phone: $phone
      }
    ) {
      user {
        isActive
        userType
        email
        password
        firstName
        lastName
        address
        personNumber
        phone
      }
    }
  }
`;
// EQUIPMENT

export const EQUIPMENT_ADD_MUTATION = gql`
  mutation addMutation(
    $idCode: String!
    $manufacture: String
    $model: String
    $info: String
    $devType: String!
  ) {
    deviceCreate(
      input: {
        idCode: $idCode
        manufacture: $manufacture
        model: $model
        info: $info
        devType: $devType
      }
    ) {
      device {
        id
      }
    }
  }
`;

export const CURRENTUSER_UPDATE_MUTATION = gql`
  mutation updateMutation(
    $firstName: String
    $lastName: String
    $address: String
    $phone: String
    $password: String
    $oldPassword: String
  ) {
    currentUserUpdate(
      input: {
        firstName: $firstName
        lastName: $lastName
        address: $address
        phone: $phone
        password: $password
        oldPassword: $oldPassword
      }
    ) {
      user {
        id
      }
    }
  }
`;
