import gql from 'graphql-tag';

export const testLogin = gql`
  query {
    login(input: { email: "1", password: "1" }) {
      jwt
    }
  }
`;

export const BACKENDTEST_QUERY = gql`
  query {
    backendTest {
      up
    }
  }
`;

export const EQUIPMENTS_QUERY = gql`
  query {
    allDevices {
      id
      idCode
      manufacture
      model
      info
      loanStatus
      createdAt
      updatedAt
      category {
        id
        deviceType
      }
    }
  }
`;

export const DEVICE_ID_QUERY = gql`
  query {
    allDevices {
      idCode
    }
  }
`;

export const USERS_QUERY = gql`
  query {
    allUsers {
      id
      isActive
      userType
      email
      firstName
      lastName
      address
      personNumber
      phone
      createdAt
      updatedAt
    }
  }
`;
export const EMAILS_QUERY = gql`
  query {
    allUsers {
      email
    }
  }
`;

export const LOANS_QUERY = gql`
  query {
    allLoans {
      id
      isActive
      loanDate
      returnDate
      dueDate
      createdAt
      updatedAt
      device {
        idCode
        manufacture
        model
        category {
          deviceType
        }
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
`;

export const CURRENTUSER = gql`
  query {
    currentUser {
      userType
      email
      firstName
      lastName
      address
      personNumber
      phone
      loans {
        id
        isActive
        loanDate
        returnDate
        dueDate
        device {
          idCode
          manufacture
          model
          category {
            deviceType
          }
        }
      }
    }
  }
`;

export const CATEGORY_QUERY = gql`
  query {
    allCategories {
      id
      deviceType
      desription
      createdAt
      updatedAt
    }
  }
`;
export const CATEGORY_NAME_QUERY = gql`
  query {
    allCategories {
      deviceType
    }
  }
`;
