import React, { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { fetchUnitTypes } from "../services/unit.service";
import UnitsTable from "../components/UnitsTable";
const StorageUnits = () => {
  const [unitTypes, setUnitTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState("all");
  const [activeTab, setActiveTab] = useState("types");
  const [statusFilter, setStatusFilter] = useState("all");
  const units = useMemo(
    () => unitTypes.flatMap((t) => t.units ?? []),
    [unitTypes],
  );

  const handleFetch = async () => {
    try {
      const data = await fetchUnitTypes();
      setUnitTypes(data);
    } catch (error) {
      console.log("Error Fetching", error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  useEffect(() => {
    if (activeTab === "types") {
      setSelectedTypeId("all");
      setStatusFilter("all");
    }
  }, [activeTab]);

  const getStatusBg = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-700";
      case "reserved":
        return "bg-blue-100 text-blue-700";
      case "occupied":
        return "bg-red-100 text-red-700";
      case "maintenance":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-400 text-gray-700";
    }
  };

  const visibleUnits = useMemo(() => {
    const byType =
      selectedTypeId === "all"
        ? units
        : units.filter((unit) => unit?.type_id === selectedTypeId);
    if (statusFilter === "all") return byType;
    return byType.filter(
      (unit) => unit?.status?.toLowerCase() === statusFilter,
    );
  }, [units, selectedTypeId, statusFilter]);

  const formatPrice = (value) => (value ? `$${value}` : "—");
  const typeById = useMemo(
    () => Object.fromEntries(unitTypes.map((t) => [String(t.id), t])),
    [unitTypes],
  );

  return (
    <div
      id="view-inventory"
      className="flex-1 flex flex-col overflow-hidden hidden-view min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100"
    >
      {/* <!-- Header --> */}
      <div className="px-6 md:px-8 py-6 border-b border-slate-200/70 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/90 backdrop-blur gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Unit Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage unit details, pricing, and availability.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-sm hover:bg-slate-800">
            <FaPlus size={14} />
            <span>Add Unit Type</span>
          </button>
          <button className="bg-accent2 hover:bg-accent2/70 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
            <FaPlus size={14} />
            <span>Add Units</span>
          </button>
        </div>
      </div>

      {/* <!-- Tabs --> */}
      <div className="px-6 md:px-8 py-3 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="inline-flex rounded-full bg-slate-100 p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("types")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition ${
              activeTab === "types"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Unit Types
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("units")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition ${
              activeTab === "units"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Units
          </button>
        </div>
      </div>

      {activeTab === "types" ? (
        <div className="px-6 md:px-8 py-5 bg-slate-50/70 border-b border-slate-200/70">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Unit Types
              </h2>
              <p className="text-sm text-slate-500">
                Click the type to see the units.
              </p>
            </div>
            <div className="text-sm text-slate-500">
              {unitTypes.length} types • {units?.length} units
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {unitTypes.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/90 p-6 text-sm text-slate-500">
                No unit types yet. Create a unit type to get started.
              </div>
            ) : (
              unitTypes.map((type) => (
                <button
                  key={type?.id}
                  type="button"
                  onClick={() => {
                    setSelectedTypeId(type?.id);
                    setActiveTab("units");
                  }}
                  className="cursor-pointer group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-indigo-400 to-slate-300" />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {type?.type_name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {parseInt(type?.sqft)} sqft • Base Price -{" "}
                        <span className="font-semibold text-slate-800">
                          {formatPrice(type?.base_price)}
                        </span>
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      {type.units.length} units
                    </span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-green-700">
                      {type.available} available
                    </span>
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-red-700">
                      {type.occupied} occupied
                    </span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                      {type.reserved} reserved
                    </span>
                    <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-yellow-700">
                      {type.maintenance} maint.
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="px-6 md:px-8 py-4 bg-white/90 backdrop-blur border-b border-slate-200/70 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedTypeId}
                onChange={(e) => setSelectedTypeId(e.target.value)}
                className="appearance-none w-full sm:w-56 bg-white border border-slate-300 text-slate-700 py-2 pl-3 pr-8 rounded-xl text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
              >
                <option value="all">All Unit Types</option>
                {unitTypes.map((type) => (
                  <option key={type?.id} value={type.id}>
                    {type?.type_name} ({parseInt(type?.sqft)} sqft)
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none w-full sm:w-48 bg-white border border-slate-300 text-slate-700 py-2 pl-3 pr-8 rounded-xl text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <div className="text-xs text-slate-500">
                Showing {visibleUnits.length} units
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleFetch()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Refresh Pricing Engine
            </button>
          </div>

          <UnitsTable
            units={visibleUnits}
            typeById={typeById}
            formatPrice={formatPrice}
            getStatusBg={getStatusBg}
          />
        </>
      )}
    </div>
  );
};

export default StorageUnits;
