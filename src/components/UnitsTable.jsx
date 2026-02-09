import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiCheckCircle, FiTool, FiSlash } from "react-icons/fi";


const UnitsTable = ({ units, typeById, formatPrice, getStatusBg }) => {
  const [openActionId, setOpenActionId] = useState(null);


  return (
    <div className="flex-1 overflow-auto px-6 md:px-8 py-5">
      <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur shadow-sm">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-linear-to-r from-slate-50 to-white sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                Unit Number
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                Type
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                Current Price
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                Tenant
              </th>
              <th className="px-10 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 ">
                Action
              </th>
            </tr>
          </thead>
          <tbody
            className="bg-white divide-y divide-slate-100"
            id="inventory-table-body"
          >
            {units.map((unit, index) => {
              const statusBg = getStatusBg(unit?.status);
              const type = typeById[String(unit?.type_id)];

              return (
                <tr
                  key={unit?.id ?? `${unit?.unit_number}-${index}`}
                  className="odd:bg-white even:bg-slate-50/40 hover:bg-slate-100/60 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-base text-slate-600">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                      {unit?.unit_number}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-slate-600">
                    {type?.type_name ?? "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-slate-500">
                    {formatPrice(unit?.unit_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-sm font-semibold ${statusBg} rounded-full`}
                    >
                      {unit?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-slate-500">
                    {unit?.current_tenant
                      ? unit.current_tenant.full_name
                      : "--"}
                  </td>
                  <td className="px-10 py-4 whitespace-nowrap text-base font-medium relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenActionId((prev) =>
                          prev === unit?.id ? null : unit?.id,
                        )
                      }
                      className="text-slate-400 hover:text-navy-900 p-1.5 hover:bg-slate-200 rounded-full transition-colors"
                      aria-haspopup="menu"
                      aria-expanded={openActionId === unit?.id}
                    >
                      <BsThreeDotsVertical />
                    </button>
                    {openActionId === unit?.id ? (
                      <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl z-20">
                        <div className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                          Set Status
                        </div>
                        <div className="py-2">
                          <button
                            type="button"
                            onClick={() => setOpenActionId(null)}
                            className="w-full px-5 py-2.5 flex items-center gap-3 text-sm text-emerald-600 hover:bg-emerald-50/60"
                          >
                            <FiCheckCircle />
                            Force Available
                          </button>
                          <button
                            type="button"
                            onClick={() => setOpenActionId(null)}
                            className="w-full px-5 py-2.5 flex items-center gap-3 text-sm text-orange-600 hover:bg-orange-50/60"
                          >
                            <FiTool />
                            Mark Maintenance
                          </button>
                          <button
                            type="button"
                            onClick={() => setOpenActionId(null)}
                            className="w-full px-5 py-2.5 flex items-center gap-3 text-sm text-rose-600 hover:bg-rose-50/60"
                          >
                            <FiSlash />
                            Deactivate Unit
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnitsTable;
