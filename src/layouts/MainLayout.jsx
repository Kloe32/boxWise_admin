import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-roboto">
      {/* sidebar/header */}
      <Sidebar />
      <main className="flex-1">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
