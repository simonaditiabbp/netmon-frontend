// ...existing code...
// This file is for custom DataTable component using react-data-table-component
"use client";
import React from "react";
import DataTable from "react-data-table-component";
import ConfirmModal from "./ConfirmModal";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function DevicesDataTable({ devices, filterText, onDelete }) {
  const [refreshFlag, setRefreshFlag] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedDevice, setSelectedDevice] = React.useState(null);
  const [deleteError, setDeleteError] = React.useState("");

  const handleDeleteClick = (device) => {
    setSelectedDevice(device);
    setModalOpen(true);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!selectedDevice) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/devices/${selectedDevice.ID}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete device");
      setModalOpen(false);
      setSelectedDevice(null);
      if (onDelete) onDelete();
    } catch (err) {
      setDeleteError("Failed to delete device: " + err.message);
    }
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setSelectedDevice(null);
    setDeleteError("");
  };

  const columns = [
    // { name: "ID", selector: row => row.ID, sortable: true, width: "80px",
    //     cell: row => <span className="text-base">{row.ID}</span>
    //  },
    // { name: "No", selector: (row, index) => index + 1, sortable: false, width: "80px", 
    //     cell: (row, index) => <span className="text-base">{index + 1}</span>
    // },
    {
        name: "No",
        width: "60px",
        cell: (row) => {
        const rowIndex = filteredDevices.findIndex(d => d.ID === row.ID);
        return <span className="text-base">{rowIndex + 1}</span>;
        },
    },
    { name: "Name", selector: row => row.Name, sortable: true, wrap: true,
        cell: row => <span className="text-base">{row.Name}</span>
    },
    { name: "IP", selector: row => row.IP, sortable: true, wrap: true, 
        cell: row => <span className="text-base">{row.IP}</span>
    },
    { name: "Status", selector: row => row.Status, sortable: true, width: "250px", 
        cell: row => <span className="text-base">{row.Status}</span>
     },
    { name: "Icon", selector: row => row.Icon, sortable: false, cell: row => <span className="text-base">{row.Icon}</span> , width: "250px" },
    {
      name: "Action",
      cell: row => (
        <div className="flex gap-4">
            {/* Update */}
            <a
                href={`/devices/update/${row.ID}`}
                title="Update"
                className="flex items-center gap-1 p-1 rounded hover:bg-indigo-100"
            >
                <PencilSquareIcon className="w-5 h-5 text-indigo-600" />
                <span className="text-sm text-indigo-600">Update</span>
            </a>

            {/* Delete */}
            <button
                title="Delete"
                className="flex items-center gap-1 p-1 rounded hover:bg-red-100"
                onClick={e => {
                e.preventDefault();
                handleDeleteClick(row);
                }}
            >
                <TrashIcon className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-600">Delete</span>
            </button>
        </div>

      ),
      ignoreRowClick: true, width: "250px"
    },
  ];

  const customStyles = {
  headCells: {
    style: (column) => (
        {
      ...(column["data-column-id"] == 6 ? { 
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


  const [localDevices, setLocalDevices] = React.useState(devices);
  React.useEffect(() => {
    setLocalDevices(devices);
  }, [devices, refreshFlag]);

  const filteredDevices = localDevices.filter(
    d =>
      d.Name?.toLowerCase().includes(filterText.toLowerCase()) ||
      d.IP?.toLowerCase().includes(filterText.toLowerCase()) ||
      d.Status?.toLowerCase().includes(filterText.toLowerCase()) ||
      String(d.ID).includes(filterText)
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredDevices}
        pagination
        highlightOnHover
        striped
        responsive
        persistTableHead
        customStyles={customStyles}
      />
      <ConfirmModal
        open={modalOpen}
        title="Delete Device"
        message={selectedDevice ? `Are you sure you want to delete device '${selectedDevice.Name}'?` : ""}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      {deleteError && (
        <div className="text-red-500 text-center mt-2">{deleteError}</div>
      )}
    </>
  );
}
