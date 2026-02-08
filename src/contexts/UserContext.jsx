import { createContext, useContext, useState, useEffect } from "react";
import { clearLocalStorage, getItemFromLocalStorage } from "../helper/helper";
import { STORAGE_KEY } from "../config/config";
const UserContext = createContext();

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp !== "number" || payload.exp < Date.now() / 1000;
  } catch (e) {
    console.log("Error checking token:", e);
    return true;
  }
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(
    getItemFromLocalStorage(STORAGE_KEY.USER_DATA),
  );
  useEffect(() => {
    const token = getItemFromLocalStorage(STORAGE_KEY.TOKEN);
    if (isTokenExpired(token)) {
      clearLocalStorage();
      setUserData(null);
    }
  }, []);

  const logout = () => {
    clearLocalStorage();
    setUserData(null);
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
