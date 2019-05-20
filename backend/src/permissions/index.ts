import { rule, shield, and, or, not } from "graphql-shield";

const isAuthenticated = rule()(async (parent, args, { currentUser }) => {
  return currentUser != null;
});
const isAdmin = rule()(async (parent, args, { currentUser }) => {
  return currentUser.type === "ADMIN";
});
const isStaff = rule()(async (parent, args, { currentUser }) => {
  return currentUser.type === "STAFF";
});
const isStudent = rule()(async (parent, args, { currentUser }) => {
  return currentUser.type === "STUDENT";
});

export const permissions = shield({
  Query: {
    currentUser: isAuthenticated,
    allUsers: or(isAdmin, isStaff),
    allCategories: isAdmin,
    allDevices: or(isAdmin, isStaff),
    allLoans: or(isAdmin, isStaff),
    oneUser: or(isAdmin, isStaff)
  },
  Mutation: {
    //login: not(isAuthenticated),
    userCreate: isAdmin,
    userUpdate: isAdmin,
    userDelete: isAdmin,
    userCreateStudent: isStaff,
    categoryCreate: isAdmin,
    categoryUpdate: isAdmin,
    categoryDelete: isAdmin,
    deviceCreate: or(isAdmin, isStaff),
    deviceUpdate: or(isAdmin, isStaff),
    deviceDelete: isAdmin,
    loanCreate: or(isAdmin, isStaff),
    loanUpdate: isAdmin,
    loanDelete: isAdmin,
    loanReturn: or(isAdmin, isStaff)
  }
});
