import React from "react";
import { sideBarItems } from "../config/routes";
import { NavLink } from "react-router-dom";
const Sidebar = () => {
  return (
    <aside className="w-74 bg-white border-r flex flex-col border-slate-200/50 shadow-sm z-10 md:flex sticky top-0 h-screen">
      {/*---------- Logo ----------*/}
      <div className="flex gap-6 py-4 justify-center">
        <div className="rounded-full w-15 h-15 p-2 bg-starblack/80">
          <img src="/logo.png" alt="" />
        </div>
        <div className="">
          <div className="text-2xl font-bold">BoxWise</div>
          <div className="text-sm text-slate-500">Admin Console</div>
        </div>
      </div>
      {/*---------- Nav ----------*/}
      <nav className="flex flex-col gap-3 px-8 py-4">
        {sideBarItems.map((item, i) => (
          <NavLink
            key={i}
            to={item?.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3  rounded-lg transition-colors ${
                isActive
                  ? "bg-starblack text-slate-100"
                  : "hover:bg-slate-200 text-slate-700"
              }`
            }
          >
            <span>{item?.icon}</span>
            <span>{item?.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
