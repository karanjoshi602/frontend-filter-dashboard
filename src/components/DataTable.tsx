import React, { useEffect, useState } from "react";
import { useFilterContext } from "../context/FilterContext";

type SortDirection = "asc" | "desc" | null;
const ROWS_PER_PAGE = 100;

const DataTable: React.FC = () => {
  const {
    originalData,
    filteredData,
    setFilteredData,
    filters,
    searchQuery,
  } = useFilterContext();

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [sortedData, setSortedData] = useState(filteredData);
  const [currentPage, setCurrentPage] = useState(1);

  
  useEffect(() => {
    const applyFilters = () => {
      const filtered = originalData.filter((row) => {
        const number = Number(row.number);
        const passesModFilters =
          (filters.mod3 === "" || number % 3 === Number(filters.mod3)) &&
          (filters.mod4 === "" || number % 4 === Number(filters.mod4)) &&
          (filters.mod5 === "" || number % 5 === Number(filters.mod5)) &&
          (filters.mod6 === "" || number % 6 === Number(filters.mod6));

        const passesSearchFilter =
          searchQuery.trim() === "" ||
          Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          );

        return passesModFilters && passesSearchFilter;
      });

      setFilteredData(filtered);
      setCurrentPage(1);
    };

    applyFilters();
  }, [filters, originalData, searchQuery, setFilteredData]);

  // Apply sorting
  useEffect(() => {
    let data = [...filteredData];

    if (sortKey && sortDirection) {
      data.sort((a, b) => {
        const aVal = a[sortKey as keyof typeof a];
        const bVal = b[sortKey as keyof typeof b];

        const aNum = Number(aVal);
        const bNum = Number(bVal);

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
        }

        return sortDirection === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    setSortedData(data);
  }, [filteredData, sortKey, sortDirection]);

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection("asc");
    } else {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") {
        setSortKey(null);
        setSortDirection(null);
      } else setSortDirection("asc");
    }
  };

  const getArrow = (col: string) => {
    if (sortKey !== col) return "⬍";
    if (sortDirection === "asc") return "▲";
    if (sortDirection === "desc") return "▼";
    return "⬍";
  };

  const columns = sortedData.length > 0 ? Object.keys(sortedData[0]) : [];
  const totalPages = Math.ceil(sortedData.length / ROWS_PER_PAGE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  if (sortedData.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600 font-medium">No matching data found</p>
        <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th
                rowSpan={2}
                className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase"
              >
                Number
              </th>
              <th
                colSpan={columns.length - 1}
                className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase border-l"
              >
                Mods
              </th>
            </tr>
            <tr>
              {columns.slice(1).map((col) => (
                <th
                  key={col}
                  onClick={() => toggleSort(col)}
                  className="px-6 py-2 text-left text-xs font-medium text-gray-600 cursor-pointer select-none hover:text-blue-600"
                >
                  <span className="flex items-center gap-1">
                    {col.toUpperCase()}
                    <span className="text-gray-800">{getArrow(col)}</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, idx) => (
              <tr
                key={idx}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition-colors`}
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-6 py-3 whitespace-nowrap text-gray-800 text-center"
                  >
                    {row[col as keyof typeof row]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 py-4 bg-gray-50 border-t">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
        >
          Prev
        </button>
        <span className="text-gray-700 text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
