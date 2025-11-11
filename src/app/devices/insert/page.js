"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/components/PageHeader";

export default function InsertDevicePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    ip: "",
    status: "offline",
    url: "",
    type_ids: []
  });
  const [deviceTypes, setDeviceTypes] = useState([]);
  React.useEffect(() => {
    async function fetchTypes() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/devices_types`);
        if (!res.ok) throw new Error("Failed to fetch device types");
        const data = await res.json();
        setDeviceTypes(data);
      } catch (err) {
        // ignore error for now
      }
    }
    fetchTypes();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  React.useEffect(() => {
    setLastUpdate(Date.now());
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleTypeChange(e) {
    const id = Number(e.target.value);
    if (e.target.checked) {
      setForm(f => ({ ...f, type_ids: [...f.type_ids, id] }));
    } else {
      setForm(f => ({ ...f, type_ids: f.type_ids.filter(tid => tid !== id) }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/devices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to insert device");
      router.push("/devices");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans">
      <PageHeader
        buttonLabel="Device Types"
        buttonHref="/"
        lastUpdate={lastUpdate}
      />
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8 w-full max-w-lg flex flex-col mt-10 mb-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Insert Device</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">IP</label>
            <input name="ip" value={form.ip} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200">
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Device Type</label>
            <div className="flex flex-wrap gap-3">
              {deviceTypes.map(dt => (
                <label key={dt.ID} className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    value={dt.ID}
                    checked={form.type_ids.includes(dt.ID)}
                    onChange={handleTypeChange}
                  />
                  <span className="text-lg">{dt.Icon}</span>
                  <span>{dt.type_name}</span>
                </label>
              ))}
            </div>
          </div>
          {/* <div>
            <label className="block mb-1 font-medium text-gray-700">URL</label>
            <input name="url" value={form.url} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div> */}
          {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition" disabled={loading}>
            {loading ? "Saving..." : "Insert Device"}
          </button>
        </form>
      </div>
    </div>
  );
}
