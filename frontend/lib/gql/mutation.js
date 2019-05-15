import gql from 'graphql-tag';

export const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(input:{email: $email, password: $password}) {
      jwt
    }
  }
`;