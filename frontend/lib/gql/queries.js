import gql from 'graphql-tag';

export const testLogin = gql`
  query {
    login (input: {email:"1", password:"1"}){
  jwt
}}`


export const EQUIPMENTS_QUERY = gql`
  query{ 
    allDevices {
      id,
      idCode,
      manufacture,
      model,
      info,
      loanStatus
        devCategory{
          id,
          deviceType
        }
    }
  }`

export const USERS_QUERY = gql`
  query{ 
    allUsers{
      id,
      isActive,
      userType,
      email,
      firstName,
      lastName,
      address,
      personNumber,
      phone,
      createdAt,
      updatedAt
    }
}`

export const LOANS_QUERY = gql`
  query{
    allLoans{
      id,
      isActive,
      loanDate,
      returnDate,
      dueDate,
      deviceId {
        idCode,
        manufacture,
        model,
        devCategory {
          deviceType
        }
      }
      loanerId {
      email,
      firstName,
      lastName
      }
      supplierId {
        email,
        firstName,
        lastName
      }
    }
  }`