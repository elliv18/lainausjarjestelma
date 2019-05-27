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

export const EQUIPMENT_UPDATE_MUTATION = gql`
  mutation updateMutation(
    $idCode: String!
    $manufacture: String
    $model: String
    $info: String
    $devCategory: ID
  ) {
    deviceUpdate(
      input: {
        idCode: $idCode
        manufacture: $manufacture
        model: $model
        info: $info
        devCategory: $devCategory
      }
    ) {
      device {
        id
      }
    }
  }
`;

export const EQUIPMENT_DELETE_MUTATION = gql`
  mutation deleteMutation($idCode: String!) {
    deviceDelete(input: { idCode: $idCode }) {
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
      }
    }
  }
`;

/********************** CATEGORY **********************/

export const CATEGORY_ADD_MUTATION = gql`
  mutation createMutation($deviceType: String!, $desription: String) {
    categoryCreate(
      input: { deviceType: $deviceType, desription: $desription }
    ) {
      category {
        id
      }
    }
  }
`;

export const CATEGORY_UPDATE_MUTATION = gql`
  mutation updateMutation($deviceType: String!, $desription: String) {
    categoryUpdate(
      input: { deviceType: $deviceType, desription: $desription }
    ) {
      category {
        id
      }
    }
  }
`;

export const CATEGORY_DELETE_MUTATION = gql`
  mutation deleteMutation($deviceType: String!) {
    categoryDelete(input: { deviceType: $deviceType }) {
      category {
        id
      }
    }
  }
`;

/************************* LOANS *************************/

export const LOAN_ADD_MUTATION = gql`
  mutation createMutation(
    $loandate: String!
    $dueDate: String!
    $devIdCode: String!
    $loaner: String!
  ) {
    loanCreate(
      input: {
        loanDate: $loandate
        dueDate: $dueDate
        devIdCode: $devIdCode
        loaner: $loaner
      }
    ) {
      loan {
        id
      }
    }
  }
`;

export const LOAN_RETURN_MUTATION = gql`
  mutation updateMutation($idCode: String!, $returnDate: String) {
    loanReturn(input: { idCode: $idCode, returnDate: $returnDate }) {
      loan {
        id
      }
    }
  }
`;

export const LOAN_UPDATE_MUTATION = gql`
  mutation updateMutation(
    $idCode: String!
    $loandate: String
    $returnDate: String
    $dueDate: String
    $deviceId: String
    $loanerId: String
    $supplierId: String
    $returnerId: String
  ) {
    loanUpdate(
      input: {
        idCode: $idCode
        loanDate: $loandate
        returnDate: $returnDate
        dueDate: $dueDate
        deviceId: $deviceId
        loanerId: $loanerId
        supplierId: $supplierId
        returnerId: $returnerId
      }
    ) {
      loan {
        id
      }
    }
  }
`;

export const LOAN_DELETE_MUTATION = gql`
  mutation deleteMutation($idCode: String!) {
    loanDelete(input: { idCode: $idCode }) {
      loan {
        id
      }
    }
  }
`;
