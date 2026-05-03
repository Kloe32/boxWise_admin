import axiosInstance from "../config/axiosInstance";
import { API_ROUTES } from "../config/config";

export const cancelBooking = async (bookingId) => {
  try {
    const response = await axiosInstance.post(
      `${API_ROUTES.CANCEL_BOOKING_URL}/${bookingId}?status=CANCELLED`,
    );
    return response.data;
  } catch (error) {
    console.log("Error cancelling booking", error);
    throw error;
  }
};

export const fetchPendingBookings = async () => {
  try {
    const response = await axiosInstance.get(
      API_ROUTES.GET_PENDING_BOOKINGS_URL,
    );
    return response.data.data;
  } catch (error) {
    console.log("Error fetching pending bookings", error);
  }
};

export const fetchBookings = async (curYear = new Date().getFullYear()) => {
  try {
    const response = await axiosInstance.get(
      `${API_ROUTES.GET_BOOKINGS_URL}?year=${curYear}`,
    );
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.log("Error fetching bookings", error);
  }
};

export const confirmBooking = async (bookingId) => {
  try {
    const response = await axiosInstance.post(
      `${API_ROUTES.CONFIRM_BOOKING_URL}/${bookingId}`,
    );
    return response.data.data;
  } catch (error) {
    console.log("Error confirming booking", error);
    throw error;
  }
};

export const confirmPayment = async (paymentId) => {
  try {
    const response = await axiosInstance.post(
      `${API_ROUTES.CONFIRM_PAYMENT_URL}/${paymentId}`,
    );
    return response.data.data;
  } catch (error) {
    console.log("Error confirming payment", error);
    throw error;
  }
};

export const vacateBooking = async (bookingId) => {
  try {
    const response = await axiosInstance.post(
      `${API_ROUTES.VACATE_BOOKING_URL}/${bookingId}`,
    );
    return response.data.data;
  } catch (error) {
    console.log("Error vacating booking", error);
    throw error;
  }
};

export const approveRenewal = async (bookingId) => {
  try {
    const response = await axiosInstance.post(
      `${API_ROUTES.APPROVE_RENEWAL_URL}/${bookingId}`,
    );
    return response.data.data;
  } catch (error) {
    console.log("Error approving renewal", error);
    throw error;
  }
};

export const approveEarlyReturn = async (bookingId) => {
  try {
    const response = await axiosInstance.post(
      `${API_ROUTES.APPROVE_EARLY_RETURN_URL}/${bookingId}`,
    );
    return response.data.data;
  } catch (error) {
    console.log("Error approving early return", error);
    throw error;
  }
};
