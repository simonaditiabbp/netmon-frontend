"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageHeader from "../../../components/PageHeader";

export default function UpdateDeviceTypePage({ params }) {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    type_name: "",
    icon: "",
    description: "",
    created_by: "system",
    updated_by: "system"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    async function fetchType() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/devices_types/${id}`);
        if (!res.ok) throw new Error("Failed to fetch device type");
        const data = await res.json();
        setForm({
          type_name: data.type_name || "",
          icon: data.Icon || "",
          description: data.Description || "",
          created_by: data.created_by || "system",
          updated_by: data.updated_by || "system"
        });
        setLastUpdate(Date.now());
      } catch (err) {
        setError(err.message);
      }
    }
    fetchType();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/devices_types/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to update device type");
      router.push("/types_devices");
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
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8 w-full max-w-lg flex flex-col mt-20 mb-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Update Device Type</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Type Name</label>
            <input name="type_name" value={form.type_name} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Icon</label>
            <input name="icon" value={form.icon} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="e.g. 🖥️" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Description</label>
            <input name="description" value={form.description} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
          {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition" disabled={loading}>
            {loading ? "Saving..." : "Update Device Type"}
          </button>
        </form>
      </div>
    </div>
  );
}
