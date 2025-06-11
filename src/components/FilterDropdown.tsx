import React from "react";
import { useFilterContext } from "../context/FilterContext";

const modLabels: Record<string, string> = {
  mod3: "Divisible by 3",
  mod4: "Divisible by 4",
  mod5: "Divisible by 5",
  mod6: "Divisible by 6",
};

const FilterDropdown: React.FC = () => {
  const {
    originalData,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
  } = useFilterContext();

  const handleChange = (modKey: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [modKey]: value }));
  };

  const handleReset = () => {
    setFilters({
      mod3: "",
      mod4: "",
      mod5: "",
      mod6: "",
    });
    setSearchQuery("");
  };

  const getDynamicOptions = (modKey: keyof typeof filters): number[] => {
    
    const filtered = originalData.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (key === modKey || value === "") return true;
        const mod = parseInt(key.replace("mod", ""));
        const remainder = Number(row.number) % mod;
        return remainder.toString() === value;
      });
    });

    
    const mod = parseInt(modKey.replace("mod", ""));
    const remainders = new Set<number>();

    filtered.forEach((row) => {
      const remainder = Number(row.number) % mod;
      remainders.add(remainder);
    });

    return Array.from(remainders).sort((a, b) => a - b);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search table..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800"
        />
      </div>

      {/* Title */}
      <div className="flex flex-col items-center space-y-1">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">Filter Options</span>
        </h2>
        <p className="text-gray-500 text-sm">Select remainders to filter numbers</p>
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.keys(filters).map((modKey) => {
          const modNum = Number(modKey.slice(3));
          const options = getDynamicOptions(modKey as keyof typeof filters);

          return (
            <div key={modKey} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {modLabels[modKey]}
                <span className="ml-1 text-xs text-gray-500">(mod {modNum})</span>
              </label>
              <select
                value={filters[modKey as keyof typeof filters]}
                onChange={(e) =>
                  handleChange(modKey as keyof typeof filters, e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
              >
                <option value="">All remainders</option>
                {options.map((val) => (
                  <option key={val} value={val.toString()}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Reset Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition flex items-center gap-2"
        >
          <span>↻</span>
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterDropdown;
