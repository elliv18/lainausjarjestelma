import gql from 'graphql-tag';

export const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(input:{email: $email, password: $password}) {
      jwt
    }
  }
`;

export const USERS_ADD_MUTATION = gql`
  mutation addMutation($isActive: Boolean!, $userType: String!, $email: String!, $password: String!,
  $firstName: String!, $lastName: String!, $address: String!, $personNumber: String!, $phone: String!) {
    userCreate(input: {
          isActive: $isActive
          userType: $userType,
          email: $email,
          password: $password,
          firstName: $firstName,
          lastName: $lastName,
          address: $address,
          personNumber: $personNumber,
          phone: $phone
        }) {
            user {
                isActive,
                userType,
                email,
                password,
                firstName,
                lastName,
                address,
                personNumber,
                phone,
          }
    }
  }
`;

export const EQUIPMENT_ADD_MUTATION = gql`
  mutation addMutation($idCode: String!, $manufacture: String, $model: String, $info: String, $devType: String!) {
    deviceCreate(input: {
      idCode: $idCode
      manufacture: $manufacture
      model: $model
      info: $info
      devType: $devType
    }) {
      device {
        id
      }
    }
  }
`