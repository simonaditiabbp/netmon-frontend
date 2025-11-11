import React from "react";

export default function PageHeader({ title, buttonLabel, buttonHref, lastUpdate }) {
  // Format waktu seperti dashboard
  function fmt(date) {
    if (!date) return "--:--:--";
    const d = new Date(date);
    return d.toLocaleTimeString();
  }

  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm w-full mb-8">
      <h1 className="text-2xl font-semibold text-gray-800">
        <a href="/">{title}</a>
      </h1>
      <div className="flex items-center gap-4">
        <a
          href={buttonHref}
          className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm border border-gray-400"
        >
          {buttonLabel}
        </a>
        <span className="text-sm text-gray-500">
          Last update: {lastUpdate ? fmt(lastUpdate) : "--:--:--"}
        </span>
      </div>
    </header>
  );
}
