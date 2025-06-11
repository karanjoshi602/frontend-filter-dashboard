import React from "react";
import FilterDropdown from "./components/FilterDropdown";
import DataTable from "./components/DataTable";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <span className="text-blue-600">Filter Dashboard</span>
            <span role="img" aria-label="filter" className="text-4xl">🔽</span>
          </h1>
          <p className="text-gray-600 text-sm">Interactive number filtering system using mod operations</p>
        </header>

        {/* Main Content */}
        <main className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-xl space-y-6">
          <FilterDropdown />
          <hr className="border-gray-100" />
          <DataTable />
        </main>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm">
          <p>Numbers dynamically filtered by search text, modulo rules, and sorted order</p>
        </footer>
      </div>
    </div>
  );
};
export default App;
