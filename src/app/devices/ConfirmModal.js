// ...existing code...
// Custom modal for confirmation using Tailwind overlays
"use client";
import React from "react";

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-2 text-center">{title}</h2>
        <p className="mb-6 text-center text-gray-700">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
