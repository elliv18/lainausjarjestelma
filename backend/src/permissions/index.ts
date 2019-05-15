import { rule, shield, and, or, not } from "graphql-shield";

const isAuthenticated = rule()(async (parent, args, { currentUser }) => {
  return currentUser !== null;
});
const isAdmin = rule()(async (parent, args, { currentUser }) => {
  return currentUser.type === "ADMIN";
});
const isStaff = rule()(async (parent, args, { currentUser }) => {
  console.log(currentUser);
  return currentUser.type === "STAFF";
});
const isStudent = rule()(async (parent, args, { currentUser }) => {
  console.log(currentUser);
  return currentUser.type === "STUDENT";
});

// Login mutation is only non auth site... not added here...
export const permissions = shield({
  Query: {
    currentUser: isAuthenticated,
    allUsers: or(isAdmin, isStaff),
    allCategories: isAdmin,
    allDevices: or(isAdmin, isStaff),
    allLoans: or(isAdmin, isStaff)
  },
  Mutation: {
    createUser: isAdmin,
    categoryCreate: isAdmin,
    deviceCreate: or(isAdmin, isStaff),
    loanCreate: or(isAdmin, isStaff)
  }
});
