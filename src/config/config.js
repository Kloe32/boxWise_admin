export const API_ROUTES = {
  // LOCAL_URL: "http://localhost:8030/api/v1",
  BASE_URL:'https://boxwise-server.onrender.com/api/v1',

  //User ROUTES
  LOGIN_URL: "/user/login",
  GET_USER_URL: "/user",
  GET_ADMIN_URL: "user/admin",
  UPDATE_USER_URL: "/user/UpdateUser",
  CREATE_USER_URL: "/user/CreateUser",
  DELETE_USER_URL: "/user/DeleteUser",

  //Unit ROUTES
  GET_UNIT_URL: "/storage-unit/with-tenant",
  GET_UNIT_TYPE_URL: "/unit-type/get-type-data",

  //BOOKING ROUTES
  GET_BOOKINGS_URL: "/bookings",
  GET_TENANT_URL: "/bookings/tenant",
  CANCEL_BOOKING_URL: "/bookings/cancel",
  CONFIRM_BOOKING_URL: "/bookings/confirm",
  CONFIRM_PAYMENT_URL: "/bookings/confirm-payment",
  VACATE_BOOKING_URL: "/bookings/confirm-booking-ending",
  APPROVE_RENEWAL_URL: "/bookings/approve-renewal",
  APPROVE_EARLY_RETURN_URL: "/bookings/approve-early-return",
  GET_PENDING_BOOKINGS_URL: "/bookings/pending-with-date",
};

export const STORAGE_KEY = {
  TOKEN: "x-access-token",
  USER_DATA: "user-data",
};
