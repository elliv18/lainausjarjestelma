import gql from 'graphql-tag';

export const testLogin = gql`
  query {login (input: {email:"1", password:"1"}){
  jwt
}}`

export const LOGIN_USERS = gql`
  query loginQuery($email: String!, $password: String!){
    login (input: {email:$email, password:$password}){
    jwt
  }}`

