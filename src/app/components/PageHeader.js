import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function PageHeader({buttonLabel, buttonHref, lastUpdate }) {
  const title = "Devices Monitoring Dashboard";
  // Format waktu seperti dashboard
  function fmt(date) {
    if (!date) return "--:--:--";
    const d = new Date(date);
    return d.toLocaleTimeString();
  }

  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm w-full mb-8">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Image
            src="/logo.png" // ganti dengan path logo kamu (misal di /public/logo.png)
            alt="Logo"
            width={40} // atur ukuran sesuai kebutuhan
            height={40}
            className="rounded" // opsional
          />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">
          <Link href="/">{title}</Link>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {
          buttonHref === "/" ? 
            <>
              <a
              href="/types_devices"
              className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm border border-gray-400"
              >
                Types Devices
              </a>
              <a
              href="/devices"
              className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm border border-gray-400"
              >
                Devices
              </a>
              <Link
                href="/"
                className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm border border-gray-400"
              >
                Dashboard
              </Link>
            </>
          : 
            (
              <a
                href={buttonHref}
                className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm border border-gray-400"
              >
                {buttonLabel}
              </a>
            )
        }        
        <span className="text-sm text-gray-500">
          Last update: {lastUpdate ? fmt(lastUpdate) : "--:--:--"}
        </span>
      </div>
    </header>
  );
}
