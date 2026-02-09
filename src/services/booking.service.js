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
