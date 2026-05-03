export const storeItemToLocalStorage = (key, item) => {
  localStorage.setItem(key, JSON.stringify(item));
};

export const getItemFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const clearLocalStorage = () => {
  return localStorage.clear();
};
export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(new Date(value))
    : "N/A";

export const addDays = (value, days) => {
  if (!value) return "N/A";
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return formatDate(date);
};
