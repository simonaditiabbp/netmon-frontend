"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import TypeDevicesDataTable from "./TypeDevicesDataTable";
import PageHeader from "../components/PageHeader";

export default function DeviceTypesPage() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [lastUpdate, setLastUpdate] = useState(null);

  async function fetchTypes() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/devices_types`);
      if (!res.ok) throw new Error("Failed to fetch device types");
      const data = await res.json();
      console.log("Fetched device types:", data);
      setTypes(data);
      setLastUpdate(Date.now());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTypes();
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans">
      <PageHeader
        buttonLabel="Devices"
        buttonHref="/"
        lastUpdate={lastUpdate}
      />
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8 w-full max-w-[1200px] flex flex-col mb-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Device Types Data</h1>
        <div className="mb-6 flex flex-row items-center justify-between gap-4">
            <Link href="/types_devices/insert" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Insert Device Type</Link>
            <input
                type="text"
                placeholder="Search type name or description..."
                className="border px-2 py-1 rounded w-full max-w-xs flex-1"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
            />
        </div>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <TypeDevicesDataTable
            types={types}
            filterText={filterText}
            onDelete={fetchTypes}
          />
        )}
      </div>
    </div>
  );
}
