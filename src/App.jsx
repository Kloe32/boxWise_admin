import { useState, useMemo } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import { useUser } from "./contexts/UserContext";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import StorageUnits from "./pages/StorageUnits";
import Booking from "./pages/Booking";

const RequireAdmin = ({ children }) => {
  const { userData } = useUser();
  if (userData?.role !== "ADMIN") return <Navigate to="/login" replace />;
  return children;
};

const RedirectIfAuthed = ({ children }) => {
  const { userData } = useUser();
  if (userData?.role === "ADMIN") return <Navigate to="/" replace />;
  return children;
};

function App() {
  const { userData } = useUser();
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: "/login",
          element: (
            <RedirectIfAuthed>
              <Login />
            </RedirectIfAuthed>
          ),
        },
        {
          path: "/",
          element: (
            <RequireAdmin>
              <MainLayout />
            </RequireAdmin>
          ),
          children: [
            { index: true, element: <Dashboard /> },
            { path: "storage-units", element: <StorageUnits /> },
            { path: "bookings", element: <Booking /> },
          ],
        },
        {
          path: "*",
          element: <Navigate to="/login" replace />,
        },
      ]),
    [userData],
  );

  return <RouterProvider router={router} />;
}

export default App;
