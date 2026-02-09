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
  }
};

export const fetchPendingBookings = async () => {
  try {
    const response = await axiosInstance.get(
      API_ROUTES.GET_PENDING_BOOKINGS_URL,
    );
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.log("Error fetching pending bookings", error);
  }
};
