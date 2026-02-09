import React from "react";
import { IoSearch } from "react-icons/io5";
import { FaBell } from "react-icons/fa6";
import { IoMdPerson } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { useUser } from "../contexts/UserContext";
const Topbar = () => {
  const { userData } = useUser();

  return (
    <div className="flex w-full items-center justify-between border-b border-slate-200/50 shadow-sm px-8 py-4 bg-white shrink-0 gap-10 sticky top-0 z-20">
      <div className="flex flex-1 w-full items-center justify-between gap-6">
        <div className="flex w-full max-w-lg items-center gap-2 rounded-xl border border-slate-300 p-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
          <IoSearch size={16} className="text-slate-500" />
          <input
            placeholder="Search storage units, booking IDs..."
            className="w-full bg-white outline-none"
          />
        </div>
        <div className="p-2 hover:bg-slate-200/50 rounded-xl cursor-pointer">
          <FaBell size={25} className="text-slate-600" />
        </div>
      </div>
      <div className="rounded-xl border-slate-200/50 border-2 p-3 flex justify-center items-center gap-3 shadow-md hover">
        <div className="p-2 rounded-lg bg-accent/30">
          <IoMdPerson size={15} />
        </div>
        <div className="flex gap-4 justify-center items-center">
          {userData?.full_name} <FaAngleDown />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
