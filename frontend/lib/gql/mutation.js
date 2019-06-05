import gql from 'graphql-tag';

/******************* LOGIN ********************/

export const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      jwt
    }
  }
`;

/******************* USERS ********************/

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
        id
        isActive
        userType
        email
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
        firstName
        lastName
        address
        personNumber
        phone
      }
    }
  }
`;

export const USER_DELETE_MUTATION = gql`
  mutation deleteMutation($id: ID!) {
    userDelete(input: { id: $id }) {
      user {
        id
      }
    }
  }
`;

export const USER_UPDATE_PW_MUTATION = gql`
  mutation updateMutation($id: ID!, $password: String!) {
    userUpdatePW(input: { id: $id, password: $password }) {
      user {
        id
      }
    }
  }
`;

/******************** EQUIPMENT (device) *************************/

export const EQUIPMENT_ADD_MUTATION = gql`
  mutation addMutation(
    $idCode: String!
    $manufacture: String
    $model: String
    $info: String
    $deviceCategory: String!
  ) {
    deviceCreate(
      input: {
        idCode: $idCode
        manufacture: $manufacture
        model: $model
        info: $info
        deviceCategory: $deviceCategory
      }
    ) {
      device {
        id
      }
    }
  }
`;

export const EQUIPMENT_UPDATE_MUTATION = gql`
  mutation updateMutation(
    $idCode: String!
    $manufacture: String
    $model: String
    $info: String
    $deviceCategory: String
  ) {
    deviceUpdate(
      input: {
        idCode: $idCode
        manufacture: $manufacture
        model: $model
        info: $info
        deviceCategory: $deviceCategory
      }
    ) {
      device {
        id
      }
    }
  }
`;

export const EQUIPMENT_DELETE_MUTATION = gql`
  mutation deleteMutation($id: ID!) {
    deviceDelete(input: { id: $id }) {
      device {
        id
      }
    }
  }
`;

/*********************** CURRENTUSER ****************************/

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
        firstName
        lastName
        address
        phone
      }
    }
  }
`;

/********************** CATEGORY **********************/

export const CATEGORY_ADD_MUTATION = gql`
  mutation createMutation($deviceCategory: String!, $desription: String) {
    categoryCreate(
      input: { deviceCategory: $deviceCategory, desription: $desription }
    ) {
      category {
        id
      }
    }
  }
`;

export const CATEGORY_UPDATE_MUTATION = gql`
  mutation updateMutation($deviceCategory: String!, $desription: String) {
    categoryUpdate(
      input: { deviceCategory: $deviceCategory, desription: $desription }
    ) {
      category {
        id
      }
    }
  }
`;

export const CATEGORY_DELETE_MUTATION = gql`
  mutation deleteMutation($deviceCategory: String!) {
    categoryDelete(input: { deviceCategory: $deviceCategory }) {
      category {
        id
      }
    }
  }
`;

/************************* LOANS *************************/

export const LOAN_ADD_MUTATION = gql`
  mutation createMutation(
    $loanDate: String!
    $dueDate: String!
    $devIdCode: String!
    $loaner: String!
  ) {
    loanCreate(
      input: {
        loandate: $loanDate
        dueDate: $dueDate
        devIdCode: $devIdCode
        loaner: $loaner
      }
    ) {
      loan {
        id
        device {
          idCode
          manufacture
          model
        }
        loaner {
          email
          firstName
          lastName
        }
        supplier {
          email
          firstName
          lastName
        }
      }
    }
  }
`;

export const LOAN_RETURN_MUTATION = gql`
  mutation loanReturn($id: ID!, $returnDate: String!) {
    loanReturn(input: { id: $id, returnDate: $returnDate }) {
      loan {
        id
        isActive
        device {
          idCode
        }
      }
    }
  }
`;

export const LOAN_DELETE_MUTATION = gql`
  mutation deleteMutation($id: ID!) {
    loanDelete(input: { id: $id }) {
      loan {
        id
      }
    }
  }
`;
