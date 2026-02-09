import React, { useEffect, useState } from "react";
import { FaChartPie } from "react-icons/fa6";
import {
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaArrowDown,
  FaTools,
} from "react-icons/fa";
import { BsHouseGearFill } from "react-icons/bs";
import { CiLock } from "react-icons/ci";
import { FaLock } from "react-icons/fa";
import UnitInfoModal from "../components/UnitInfoModal";
import { fetchUnits } from "../services/unit.service";
import { fetchPendingBookings } from "../services/booking.service";
const Dashboard = () => {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [pendingBookings, setPendingBookings] = useState([]);

  //for occupancy metric
  const totalUnits = units.length;
  const occupiedUnits = units.filter(
    (u) => u?.status?.toLowerCase() === "occupied",
  ).length;

  const occupancyPercent = totalUnits
    ? Math.round((occupiedUnits / totalUnits) * 100)
    : 0;

  //for pending metric
  const totalPending = pendingBookings?.totalPending?.length;
  const differenceInPending =
    pendingBookings?.todayPending - pendingBookings?.yesterdayPending || 0;

  const getIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return <FaCheckCircle size={20} />;
      case "reserved":
        return <FaClock size={20} />;
      case "occupied":
        return <FaLock size={16} />;
      case "maintenance":
        return <FaTools size={16} />;
      default:
        return <CiLock size={16} />;
    }
  };
  let statusColor = "";
  const getColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return (statusColor =
          "border-green-500 bg-green-200/20 text-green-700");
      case "reserved":
        return (statusColor = "border-blue-500 bg-blue-200/20 text-blue-700");
      case "occupied":
        return (statusColor = "border-red-500 bg-red-200/20 text-red-700");
      case "maintenance":
        return (statusColor =
          "border-yellow-500 bg-yellow-200/20 text-yellow-700");
      default:
        return (statusColor = "border-gray-500 bg-gray-200/20 text-gray-700");
    }
  };
  const formatDate = (value) =>
    value
      ? new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }).format(new Date(value))
      : "N/A";

  const addDays = (value, days) => {
    if (!value) return "N/A";
    const date = new Date(value);
    date.setDate(date.getDate() + days);
    return formatDate(date);
  };
  const handleFetch = async () => {
    try {
      const response = await fetchUnits();
      const pending = await fetchPendingBookings();
      setUnits(response);
      setPendingBookings(pending);
    } catch (e) {
      console.log("Error Fetching unit", e);
    }
  };

  const groupedUnits = (units ?? []).reduce((acc, unit) => {
    const label = unit?.type?.type_name ?? "Other";
    if (!acc[label]) acc[label] = [];
    acc[label].push(unit);
    return acc;
  }, {});

  const getDetails = (unit) => {
    const status = unit?.status?.toLowerCase() ?? "available";
    const base = [
      { label: "Unit", value: unit?.unit_number ?? "N/A" },
      { label: "Type", value: unit?.type?.type_name ?? "Standard" },
      {
        label: "Size",
        value: unit?.type?.sqft ? `${parseInt(unit.type.sqft)} sqft` : "—",
      },
    ];

    if (status === "occupied") {
      return {
        title: "Occupied Unit",
        status: "Occupied",
        sections: [
          {
            title: "Tenant & Lease",
            fields: [
              {
                label: "Tenant",
                value: unit?.bookings[0]?.user?.full_name || "N/A",
              },
              {
                label: "Lease Start",
                value: unit?.bookings[0]?.start_date ?? "N/A",
              },
              {
                label: "Lease End",
                value: unit?.bookings[0].end_date ?? "N/A",
              },
            ],
          },
          {
            title: "Payments",
            fields: [
              {
                label: "Booking ID",
                value: unit?.bookings[0]?.id ?? "N/A",
              },
              ,
              {
                label: "Upcoming Payment",
                value: unit?.bookings[0]?.payments[0]?.due_date ?? "N/A",
              },
              {
                label: "Amount",
                value: unit?.bookings[0]?.payments[0]?.amount
                  ? `$${unit.bookings[0].payments[0].amount}`
                  : "N/A",
              },
            ],
          },
        ],
        base,
      };
    }

    if (status === "reserved") {
      return {
        title: "Reserved Unit",
        status: "Reserved",
        sections: [
          {
            title: "Hold Details",
            fields: [
              {
                label: "Hold Start",
                value: unit?.bookings[0]?.createdAt
                  ? formatDate(unit.bookings[0].createdAt)
                  : "N/A",
              },
              {
                label: "Hold End",
                value: addDays(unit?.bookings[0]?.createdAt, 5) ?? "N/A",
              },
              { label: "Hold Duration", value: "5 days" },
            ],
          },
          {
            title: "Payments",
            fields: [
              {
                label: "Initial Payment",
                value: `$${unit?.bookings[0]?.payments[0]?.amount ?? "N/A"}`,
              },
              {
                label: "Payment Deadline",
                value: addDays(unit?.bookings[0]?.createdAt, 5) ?? "N/A",
              },
              { label: "Monthly Rate", value: `$${unit?.unit_price ?? "N/A"}` },
            ],
          },
        ],
        base,
      };
    }

    return {
      title: "Available Unit",
      status: "Available",
      sections: [
        {
          title: "Unit Details",
          fields: [
            {
              label: "Rate",
              value: unit?.unit_price ? `$${unit.unit_price}` : "N/A",
            },
          ],
        },
      ],
      base,
    };
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
                <h3 className="text-3xl font-bold text-navy-900 mt-1">
                  {occupancyPercent}%
                </h3>
              </div>
              <div className="bg-blue-50 p-2.5 rounded-xl">
                <FaChartPie size={16} className="text-primary" />
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
              <div
                className={`bg-primary h-2 rounded-full w-[${occupancyPercent}%]`}
              ></div>
            </div>
            <p className="text-xs text-slate-400">
              {`${occupiedUnits}/${totalUnits}`} Units Occupied
            </p>
          </div>

          {/* <!-- Metric 2: Upcoming Reservations --> */}
          <div className="bg-white/90 backdrop-blur px-6 py-8 rounded-2xl shadow-sm border border-slate-200/70 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 h-full w-1.5 bg-green-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  Pending Reservations
                </p>
                <h3 className="text-3xl font-bold text-navy-900 mt-1">
                  {totalPending || 0}
                </h3>
              </div>
              <div className="bg-green-100/90 p-2.5 rounded-xl text-green-500">
                <FaCalendarCheck size={16} />
              </div>
            </div>
            <div
              className={`flex items-center gap-2 text-sm ${differenceInPending >= 0 ? "text-green-600" : "text-red-600"} font-medium`}
            >
              <i className="ph-bold ph-trend-up"></i>

              <span className="flex gap-2 items-center">
                {differenceInPending >= 0 ? (
                  `+ ${differenceInPending} `
                ) : (
                  <span className="flex items-center gap-1">
                    <FaArrowDown size={12} />
                    {Math.abs(differenceInPending)}
                  </span>
                )}
                today
              </span>
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
            <div className="p-5 md:p-6 border-b border-slate-100 bg-linear-to-r from-white via-slate-50 to-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                  <BsHouseGearFill size={16} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-navy-900">
                    Facility Map
                  </h2>
                  <p className="text-sm text-slate-500">
                    Visual overview of unit availability and status.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full font-semibold border border-slate-200">
                  {units?.length} Units
                </span>
                <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full font-semibold border border-slate-200">
                  Live Status
                </span>
              </div>
            </div>

            {/* <!-- Legend --> */}
            <div className="px-5 md:px-6 py-4 border-b border-slate-100 bg-white">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  Available
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Reserved
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  Occupied
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  Maintenance
                </span>
              </div>
            </div>

            {/* <!-- The Grouped Layout for Units --> */}
            <div
              className="p-5 md:p-6 bg-slate-50/60 flex-1 overflow-auto flex-col"
              id="unit-grid"
            >
              <div className="grid gap-6">
                {Object.keys(groupedUnits).map((groupName) => (
                  <div
                    key={groupName}
                    className="rounded-2xl border border-slate-200 bg-white/90 p-4 md:p-5"
                  >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {groupName}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {groupedUnits[groupName].map((u, i) => {
                        statusColor = getColor(u?.status);
                        return (
                          <button
                            key={`${groupName}-${i}`}
                            type="button"
                            onClick={() => setSelectedUnit(u)}
                            className={`${u?.status === "MAINTENANCE" ? "pointer-events-none opacity-50" : ""}  text-left rounded-2xl border  px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${statusColor}`}
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-md font-semibold">
                                {u?.unit_number ?? "N/A"}
                              </p>
                              <span className="inline-flex h-6 w-6 p-0.5 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                                {getIcon(u?.status)}
                              </span>
                            </div>

                            <div className="mt-3 text-sm">
                              {u?.type?.type_name ?? "Type"}
                            </div>
                            <div className="text-sm mt-1 text-navy-900">
                              {u?.type?.sqft
                                ? `${parseInt(u.type.sqft)} sqft`
                                : "—"}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* <!-- Mini Footer for Map --> */}
            <div className="px-5 md:px-6 py-3 bg-white border-t border-slate-100 text-xs text-slate-400 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
              <span>
                Last updated: Just now (Will be real-time after implementing
                web-socket)
              </span>
              <span>Click a unit to manage</span>
            </div>
          </div>
        </div>
      </div>

      <UnitInfoModal
        selectedUnit={selectedUnit}
        details={selectedUnit ? getDetails(selectedUnit) : null}
        onClose={() => setSelectedUnit(null)}
      />
    </div>
  );
};

export default Dashboard;
