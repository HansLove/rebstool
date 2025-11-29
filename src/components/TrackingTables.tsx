/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function TrackingTables({ registrations }) {
    const [filterType, setFilterType] = useState('all');
    const [globalFilter, setGlobalFilter] = useState('');

    const handleExport = () => {
        const exportData = table.getFilteredRowModel().rows.map((row) => {
            const rowData = {};
            row.getVisibleCells().forEach((cell) => {
                const key:any = cell.column.columnDef.header;
                rowData[key] = cell.getValue();
            });
            return rowData;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'sub_affiliates.xlsx');
    };


    const filteredData = useMemo(() => {
        if (filterType === 'default') {
            return registrations.filter((r) => r.tracking_code?.toLowerCase() === 'default');
        } else if (filterType === 'custom') {
            return registrations.filter((r) => r.tracking_code?.toLowerCase() !== 'default');
        } else {
            return registrations;
        }
    }, [registrations, filterType]);

    const columns = useMemo(
        () => [
            {
                header: 'Customer Name',
                accessorKey: 'customer_name',
            },
            {
                header: 'Country',
                accessorKey: 'country',
            },
            {
                header: 'Tracking Code',
                accessorKey: 'tracking_code',
            },
            {
                header: 'First Deposit',
                accessorKey: 'first_deposit',
                cell: (info) => `$${info.getValue().toFixed(2)}`,
            },
            {
                header: 'Status',
                accessorKey: 'status',
            },
        ],
        []
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            globalFilter,
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-4">
            <button
                onClick={handleExport}
                className="border rounded px-3 py-1 bg-green-600 text-white hover:bg-green-700"
            >
                Export to Excel
            </button>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border rounded px-2 py-1 "
                    >
                        <option value="all">All</option>
                        <option value="default">Default</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>

                <input
                    type="text"
                    placeholder="Search..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="border rounded px-2 py-1 w-full md:w-64"
                />
            </div>

            <div className="overflow-x-auto max-h-[600px] overflow-y-scroll border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="px-4 py-2 text-left font-medium">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-4 py-2">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between pt-4 text-sm">
                <div className="flex gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

                <span>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
            </div>
        </div>
    );
}
