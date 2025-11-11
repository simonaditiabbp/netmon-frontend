"use client";
import React from "react";
import DataTable from "react-data-table-component";
import ConfirmModal from "../devices/ConfirmModal";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function TypeDevicesDataTable({ types, filterText, onDelete }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState(null);
  const [deleteError, setDeleteError] = React.useState("");

  const filteredTypes = types.filter(
    t => t.type_name.toLowerCase().includes(filterText.toLowerCase()) ||
         t.Description?.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleDeleteClick = (type) => {
    setSelectedType(type);
    setModalOpen(true);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!selectedType) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/devices_types/${selectedType.ID}`, { method: "DELETE" });
      if (res.status === 400) {
        throw new Error("Cannot delete device type because it is associated with existing devices.");
      }
      if (!res.ok) throw new Error("Failed to delete device type");
      setModalOpen(false);
      setSelectedType(null);
      if (onDelete) onDelete();
    } catch (err) {
      setDeleteError("Failed to delete device type: " + err.message);
    }
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setSelectedType(null);
    setDeleteError("");
  };

  const columns = [
    {
      name: "No",
      width: "60px",
      cell: (row) => {
        const rowIndex = filteredTypes.findIndex(t => t.ID === row.ID);
        return <span className="text-base">{rowIndex + 1}</span>;
      },
    },
    {
      name: "Icon",
      width: "90px",
      cell: row => <span className="text-xl">{row.Icon}</span>,
    },
    {
      name: "Type Name",
      selector: row => row.type_name,
      sortable: true,
      wrap: true,
      cell: row => <span className="text-base">{row.type_name}</span>
    },
    {
      name: "Description",
      selector: row => row.Description,
      sortable: true,
      wrap: true,
      cell: row => <span className="text-base">{row.Description}</span>
    },
    {
      name: "Action",
      width: "230px",
      cell: row => (
        <div className="flex gap-4">
          <a
            href={`/types_devices/update/${row.ID}`}
            title="Update"
            className="flex items-center gap-1 p-1 rounded hover:bg-indigo-100"
          >
            <PencilSquareIcon className="w-5 h-5 text-indigo-600" />
            <span className="text-sm text-indigo-600">Update</span>
          </a>
          <button
            title="Delete"
            className="flex items-center gap-1 p-1 rounded hover:bg-red-100"
            onClick={() => handleDeleteClick(row)}
          >
            <TrashIcon className="w-5 h-5 text-red-600" />
            <span className="text-sm text-red-600">Delete</span>
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
        headCells: {
            style: (column) => (
                {
            ...(column["data-column-id"] == 5 ? { 
                    fontSize: '1.10rem',
                    fontWeight: '700',
                    color: '#111827',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    justifyContent: 'center', 
                    textAlign: 'center' 
                } : {
                        fontSize: '1.10rem',
                        fontWeight: '700',
                        color: '#111827',
                        paddingLeft: '16px',
                        paddingRight: '16px'
                    }
                )}
            )
        }
    };

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredTypes}
        pagination
        highlightOnHover
        striped
        noDataComponent={<div className="py-8 text-gray-500">No device types found.</div>}
        customStyles={customStyles}
      />
      <ConfirmModal
        open={modalOpen}
        title="Delete Device Type"
        message={`Are you sure you want to delete device type:\n${selectedType?.Icon}\n${selectedType?.type_name}`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      {deleteError && (
        <div className="text-red-500 text-center mt-2">{deleteError}</div>
      )}
    </>
  );
}
