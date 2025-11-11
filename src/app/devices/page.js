"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "../components/PageHeader";
import DevicesDataTable from "./DevicesDataTable";

export default function DevicesDataPage() {
  const [filterText, setFilterText] = useState("");
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchDevices = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/devices`);
      if (!res.ok) throw new Error("Failed to fetch devices");
      const data = await res.json();
      setDevices(data);
      setLastUpdate(Date.now());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans">
      <PageHeader
        buttonLabel="Dashboard"
        buttonHref="/"
        lastUpdate={lastUpdate}
      />
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8 w-full max-w-[1600px] flex flex-col mb-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Devices Data</h1>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="mb-6 flex flex-row items-center justify-between gap-4">
            <Link href="/devices/insert" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Insert Device</Link>
            <input
              type="text"
              placeholder="Search..."
              className="border px-2 py-1 rounded w-full max-w-xs flex-1"
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />            
          </div>
        )}
        {!loading && !error && (
          <DevicesDataTable devices={devices} filterText={filterText} onDelete={fetchDevices} />
        )}
      </div>
    </div>
  );
}
