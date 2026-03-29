import React, { useState } from "react";
import ResultCard from "../components/ResultCard";

const History = () => {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("vinHistory")) || [];
    } catch (error) {
      return [];
    }
  });

  const clearHistory = () => {
    sessionStorage.removeItem("vinHistory");
    setHistory([]);
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold">Search History</h2>
        {history.length > 0 && (
          <button onClick={clearHistory} className="text-red-500 font-bold text-sm hover:underline">
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-slate-500 text-center mt-20">No search history found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          {history.map((item, index) => (
            <ResultCard key={index} data={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
