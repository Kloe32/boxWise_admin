import React, { useEffect, useState } from "react";
import { FaChartPie } from "react-icons/fa6";
import { FaCalendarCheck, FaCheckCircle, FaClock } from "react-icons/fa";
import { BsHouseGearFill } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { fetchUnits } from "../services/unit.service";
const Dashboard = () => {
  const [units, setUnits] = useState([]);

  let statusColor = "";
  const getIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return <FaCheckCircle size={20} />;
      case "reserved":
        return <FaClock size={20} />;
      case "occupied":
        return <FaLock size={20} />;
      case "maintenance":
        return <BsHouseGearFill size={20} />;
      default:
        return <CiLock size={20} />;
    }
  };
  const getColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return (statusColor = "border-green-500/60 bg-green-500/85");
      case "reserved":
        return (statusColor = "border-blue-500/60 bg-blue-500/85");
      case "occupied":
        return (statusColor = "border-red-500/60 bg-red-500/85");
      case "maintenance":
        return (statusColor = "border-yellow-400/60 bg-yellow-400/85");
      default:
        return (statusColor = "border-slate-300/60 bg-slate-300/85");
    }
  };

  const handleFetch = async () => {
    try {
      const response = await fetchUnits();
      setUnits(response);
    } catch (e) {
      console.log("Error Fetching unit", e);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-semibold text-navy-900">
          Facility Overview
        </h1>
        <p className="text-sm md:text-base text-slate-500">
          Real-time snapshot of occupancy, reservations, and unit status.
        </p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        <div className="xl:col-span-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
          {/* -- Metric 1: Occupancy --> */}
          <div className="bg-white/90 backdrop-blur px-6 py-8 rounded-2xl shadow-sm border border-slate-200/70 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 h-full w-1.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  Current Occupancy
                </p>
                <h3 className="text-3xl font-bold text-navy-900 mt-1">78%</h3>
              </div>
              <div className="bg-blue-50 p-2.5 rounded-xl">
                <FaChartPie size={16} className="text-primary" />
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
              <div className="bg-primary h-2 rounded-full w-[78%]"></div>
            </div>
            <p className="text-xs text-slate-400">14/18 Units Occupied</p>
          </div>

          {/* <!-- Metric 2: Upcoming Reservations --> */}
          <div className="bg-white/90 backdrop-blur px-6 py-8 rounded-2xl shadow-sm border border-slate-200/70 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 h-full w-1.5 bg-green-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  Pending Reservations
                </p>
                <h3 className="text-3xl font-bold text-navy-900 mt-1">7</h3>
              </div>
              <div className="bg-green-100/90 p-2.5 rounded-xl text-green-500">
                <FaCalendarCheck size={16} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <i className="ph-bold ph-trend-up"></i>
              <span>+2 today</span>
              <span className="text-slate-400 font-normal">vs yesterday</span>
            </div>
          </div>

          {/* -- Metric 3: Total Units --> */}
          <div className="bg-white/90 backdrop-blur px-6 py-8 rounded-2xl shadow-sm border border-slate-200/70 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 h-full w-1.5 bg-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  Total Units
                </p>
                <h3 className="text-3xl font-bold text-navy-900 mt-1">
                  {units?.length}
                </h3>
              </div>
              <div className="bg-indigo-100/90 p-2.5 rounded-xl text-indigo-500">
                <BsHouseGearFill size={16} />
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Organized by type, size, and availability
            </p>
          </div>
        </div>
        <div className="xl:col-span-3 flex flex-col lg:flex-row gap-6 min-h-125">
          {/* <!-- Map Container --> */}
          <div className="flex-1 bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-slate-200/70 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-lg text-navy-900">
                  Facility Map
                </h2>
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-lg font-medium border border-slate-200">
                  {units?.length} Units
                </span>
              </div>
              {/* <!-- Legend --> */}
              <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>{" "}
                    Available
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>{" "}
                    Reserved
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>{" "}
                    Occupied
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>{" "}
                    Maintenance
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- The Grid Layout for Units --> */}
            <div className="p-4 bg-slate-50/60 flex-1 overflow-auto flex-col">
              <div
                className="grid grid-cols-2 md:grip-cols-4 sm:grid-cols-4 lg:grid-cols-6 gap-4"
                id="unit-grid"
              >
                {units?.map((u, i) => {
                  getColor(u?.status);
                  return (
                    <div
                      key={i}
                      className={`${statusColor} text-white relative p-3 pl-4 flex flex-col gap-3 rounded-2xl border shadow-sm text-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all hover:cursor-pointer`}
                    >
                      <div className="flex items-center justify-between text-xl font-bold">
                        {u?.unit_number ? u.unit_number : "N/A"}
                        {getIcon(u?.status)}
                      </div>
                      <p className="font-bold">{u?.type?.type_name}</p>
                      <p>
                        {u?.type?.sqft ? `${parseInt(u.type.sqft)} sqft` : "-"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* <!-- Mini Footer for Map --> */}
            <div className="p-3 bg-white border-t border-slate-100 text-xs text-slate-400 flex justify-between">
              <span>
                Last updated: Just now (Will be real-time after implementing
                web-socket)
              </span>
              <span>Click a unit to manage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
