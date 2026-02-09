export const API_ROUTES = {
  LOCAL_URL: "http://localhost:8030/api/v1",
  // BASE_URL:'https://shopping-server-nerj.onrender.com/api/v1',

  //User ROUTES
  LOGIN_URL: "/user/login",
  GET_USER_URL: "/user",
  GET_ADMIN_URL: "user/admin",
  UPDATE_USER_URL: "/user/UpdateUser",
  CREATE_USER_URL: "/user/CreateUser",
  DELETE_USER_URL: "/user/DeleteUser",

  //Unit ROUTES
  GET_UNIT_URL: "/storage-unit/with-tenant",
  GET_UNIT_TYPE_URL: "/unit-type",

  //BOOKING ROUTES
  GET_TENANT_URL: "/bookings/tenant",
  CANCEL_BOOKING_URL: "/bookings/cancel",
};

export const STORAGE_KEY = {
  TOKEN: "x-access-token",
  USER_DATA: "user-data",
};
