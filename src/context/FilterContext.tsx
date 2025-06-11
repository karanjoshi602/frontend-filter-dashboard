import React, { createContext, useState, useEffect, useContext } from "react";
import { parseCSV } from "../utils/csvParser";
import type { ParsedCSVRow } from "../utils/csvParser";

interface FilterState {
  mod3: string;
  mod4: string;
  mod5: string;
  mod6: string;
}

interface FilterContextProps {
  originalData: ParsedCSVRow[];
  filteredData: ParsedCSVRow[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setFilteredData: (data: ParsedCSVRow[]) => void;
}

export const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error("FilterContext must be used within FilterProvider");
  return context;
};

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [originalData, setOriginalData] = useState<ParsedCSVRow[]>([]);
  const [filteredData, setFilteredData] = useState<ParsedCSVRow[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    mod3: "",
    mod4: "",
    mod5: "",
    mod6: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    parseCSV("/dataset_small.csv").then((data) => {
      const enrichedData = data.map((row) => {
        const number = Number(row.number);
        return {
          ...row,
          mod3: number % 3,
          mod4: number % 4,
          mod5: number % 5,
          mod6: number % 6,
        };
      });
      setOriginalData(enrichedData);
      setFilteredData(enrichedData);
    });
  }, []);

  return (
    <FilterContext.Provider
      value={{
        originalData,
        filteredData,
        filters,
        setFilters,
        searchQuery,
        setSearchQuery,
        setFilteredData,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
