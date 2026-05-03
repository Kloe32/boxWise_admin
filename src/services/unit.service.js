import axiosInstance from "../config/axiosInstance";
import { API_ROUTES } from "../config/config";

export const fetchUnits = async () => {
  try {
    const response = await axiosInstance.get(API_ROUTES.GET_UNIT_URL);
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.log("error fetching units", error);
  }
};

export const fetchUnitTypes = async () => {
  try {
    const response = await axiosInstance.get(API_ROUTES.GET_UNIT_TYPE_URL);
    console.log("Unit Types----", response.data.data);
    return response.data.data;
  } catch (error) {
    console.log("Error fetching unit types", error);
  }
};
