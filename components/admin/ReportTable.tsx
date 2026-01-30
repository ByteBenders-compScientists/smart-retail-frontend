/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Download } from 'lucide-react';

interface ReportRow {
  id: string;
  [key: string]: any;
}

interface ReportTableProps {
  title: string;
  columns: {
    key: string;
    label: string;
    format?: (value: any) => string;
  }[];
  data: ReportRow[];
  onExport?: () => void;
  showExport?: boolean;
  showSummary?: boolean;
  summaryData?: { label: string; value: string }[];
}

export default function ReportTable({ 
  title, 
  columns, 
  data, 
  onExport,
  showExport = true,
  showSummary = false,
  summaryData = []
}: ReportTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center space-x-3">
            {showExport && (
              <button
                onClick={onExport}
                className="flex bg-blue-600 hover:bg-blue-700 items-center space-x-2 px-4 py-2 text-white rounded-md transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl mb-2">📊</span>
                    <p className="font-medium">No data available</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr 
                  key={row.id} 
                  className={`hover:bg-blue-50 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.format
                        ? column.format(row[column.key])
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Summary */}
      {data.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{data.length}</span> {data.length === 1 ? 'entry' : 'entries'}
            </p>
            {showSummary && summaryData.length > 0 && (
              <div className="flex items-center space-x-4">
                {summaryData.map((item, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="text-gray-600">{item.label}: </span>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}