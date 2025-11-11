"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "./components/PageHeader";

function fmt(date) {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  return isNaN(parsedDate)
    ? "N/A"
    : parsedDate.toLocaleTimeString("id-ID", { hour12: false });
}

export default function DevicesDashboard() {
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [selectedTypeIds, setSelectedTypeIds] = useState([]);
  const [devices, setDevices] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [filter, setFilter] = useState("all");
  const [summary, setSummary] = useState({ total: 0, online: 0, offline: 0 });
  const [message, setMessage] = useState(null);

  /*useEffect(() => {
    const eventSource = new window.EventSource(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sse`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setDevices(data.devices || []);
        setSummary({
          total: data.total ?? (data.devices ? data.devices.length : 0),
          online: data.online ?? 0,
          offline: data.offline ?? 0,
        });
        setLastUpdate(new Date());
      } catch (err) {
        setDevices([]);
        setSummary({ total: 0, online: 0, offline: 0 });
        setLastUpdate(new Date());
      }
    };
    return () => {
      eventSource.close();
    };
  }, []);*/

  // Ambil daftar device types sekali
  useEffect(() => {
    async function fetchTypes() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/devices_types`);
        if (!res.ok) throw new Error("Failed to fetch device types");
        const data = await res.json();
        setDeviceTypes(data);
      } catch {}
    }
    fetchTypes();
  }, []);

  // Polling data devices, tergantung selectedTypeIds
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/live`;
        let isArrayResponse = false;
        if (selectedTypeIds.length > 0) {
          const params = selectedTypeIds.map(id => `type_ids=${id}`).join('&');
          url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/devices/by-types?${params}`;
          isArrayResponse = true;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();

        if (!isMounted) return;

        // Jika response array, summary bar hitung manual
        let devicesData = isArrayResponse ? data : (data.devices || []);
        setDevices(devicesData);
        setSummary({
          total: devicesData.length,
          online: devicesData.filter(d => d.Status === "online").length,
          offline: devicesData.filter(d => d.Status === "offline").length,
        });
        setLastUpdate(new Date());
        setMessage("success");
      } catch (err) {
        if (!isMounted) return;
        console.log("Fetch error:", err);
        setDevices([]);
        setSummary({ total: 0, online: 0, offline: 0 });
        setLastUpdate(new Date());
        setMessage("failed");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedTypeIds]);


  const filteredDevices =
    filter === "all"
      ? devices
      : devices.filter((d) =>
          filter === "online" ? d.Status === "online" : d.Status === "offline"
        );
  const { total, online, offline } = summary;

return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        <PageHeader
        buttonLabel="Manage Devices"
        buttonHref="/devices"
        lastUpdate={lastUpdate}
        />    

        {/* Summary Bar */}
        <section className="flex flex-wrap justify-center gap-4 px-8 py-5 bg-gray-50">
        <div
            className="bg-white rounded-xl shadow-md p-4 text-center flex-1 min-w-[160px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border border-gray-200"
            onClick={() => setFilter("all")}
        >
            <div className="text-sm text-gray-500">Total Devices</div>
            <div className="text-2xl font-bold mt-1">{total}</div>
        </div>
        <div
            className="bg-white rounded-xl shadow-md p-4 text-center flex-1 min-w-[160px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border border-gray-200"
            onClick={() => setFilter("online")}
        >
            <div className="text-sm text-gray-500">Online</div>
            <div className="text-2xl font-bold mt-1 text-green-600">{online}</div>
        </div>
        <div
            className="bg-white rounded-xl shadow-md p-4 text-center flex-1 min-w-[160px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border border-gray-200"
            onClick={() => setFilter("offline")}
        >
            <div className="text-sm text-gray-500">Offline</div>
            <div className="text-2xl font-bold mt-1 text-red-500">{offline}</div>
        </div>
        </section>

        {/* Filter Device Types */}
        <section className="flex flex-wrap items-center gap-3 px-8 pt-5 pb-2">
          <span className="font-medium text-gray-700 mr-2">Filter by Device Type:</span>
          {deviceTypes.map(dt => (
            <label key={dt.ID} className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer">
              <input
                type="checkbox"
                value={dt.ID}
                checked={selectedTypeIds.includes(dt.ID)}
                onChange={e => {
                  const id = Number(e.target.value);
                  setSelectedTypeIds(sel =>
                    e.target.checked
                      ? [...sel, id]
                      : sel.filter(tid => tid !== id)
                  );
                }}
              />
              <span className="text-lg">{dt.Icon}</span>
              <span>{dt.type_name}</span>
            </label>
          ))}
          {deviceTypes.length > 0 && (
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm border border-gray-300"
              onClick={() => {
                    setSelectedTypeIds([]) 
                    setFilter("all")
                }
              }
            >
              Clear Filter
            </button>
          )}
        </section>

        {/* Grid Dashboard */}
        <main
            className="grid gap-5 p-8"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
        >
            {message === "failed" ? (
                <div className="col-span-full w-full flex flex-col items-center justify-center py-16">
                    <div className="text-3xl mb-2">⚠️</div>
                    <div className="text-lg font-semibold text-gray-700">Failed to fetch data from server</div>
                    <div className="text-sm text-gray-500 mt-2">Please check the API connection or refresh the page.</div>
                </div>
            ) : filteredDevices.length === 0 ? (
                <div className="col-span-full w-full flex flex-col items-center justify-center py-16">
                    <div className="text-3xl mb-2">ℹ️</div>
                    <div className="text-lg font-semibold text-gray-700">No devices found for the selected filter.</div>
                </div>
            ) : (
                filteredDevices.map((d) => (
                    <div
                        key={d.ID}
                        className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                        data-status={d.Status}
                        >
                        <div className="flex items-start space-x-3">
                            <div className="flex items-center justify-center w-[38px] h-[38px] rounded-[10px] bg-indigo-100 text-[1.2rem]">
                            {d.Icon}
                            </div>
                            <div className="flex flex-col">
                            <h2 className="font-semibold text-gray-800 leading-tight text-[15px]">
                                {d.Name}
                            </h2>
                            <p className="text-[12px] text-gray-500">{d.IP}</p>
                            </div>
                        </div>

                        {/* Baris bawah: status + last online */}
                        <div className="flex justify-between items-center mt-3 text-[11px] text-gray-500">
                            {d.Status !== "online" ? (
                            <p className="text-gray-400">Last Online: {fmt(d.LastOnline)}</p>
                            ) : (
                            <p className="text-gray-400"></p>
                            )}
                            <p className="flex items-center gap-1">
                            {d.Status === "online" ? (
                                <span className="text-green-500">🟢</span>
                            ) : (
                                <span className="text-red-500">🔴</span>
                            )}
                            {d.Status === "online" ? "Online" : "Offline"}
                            </p>    
                        </div>
                    </div>
                ))
            )}
        </main>
    </div>
    );
}
