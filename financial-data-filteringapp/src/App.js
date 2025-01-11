






import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [minRevenue, setMinRevenue] = useState("");
  const [maxRevenue, setMaxRevenue] = useState("");
  const [minNetIncome, setMinNetIncome] = useState("");
  const [maxNetIncome, setMaxNetIncome] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' for ascending, 'desc' for descending

  const API_KEY = "<cb7lkLoND5MZkrlJshUeFQjVAXTdmfkR>"; // Replace with your API key
  const API_URL = `https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=${API_KEY}`;
  

  // Fetch data from the API
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [API_URL]);

  // Filter data based on user input
  const filteredData = data.filter((item) => {
    const itemYear = parseInt(item.date.split("-")[0], 10); // Extract year from the date
    const minDateInt = minDate ? parseInt(minDate, 10) : null;
    const maxDateInt = maxDate ? parseInt(maxDate, 10) : null;

    return (
      (!minDateInt || itemYear >= minDateInt) &&
      (!maxDateInt || itemYear <= maxDateInt) &&
      (!minRevenue || item.revenue >= parseFloat(minRevenue)) &&
      (!maxRevenue || item.revenue <= parseFloat(maxRevenue)) &&
      (!minNetIncome || item.netIncome >= parseFloat(minNetIncome)) &&
      (!maxNetIncome || item.netIncome <= parseFloat(maxNetIncome))
    );
  });

  // Sort the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0; // No sorting if no field selected

    const valueA = a[sortField];
    const valueB = b[sortField];

    if (sortOrder === "asc") {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  });

  return (
    <div className="overflow-auto p-4">
      <h1 className=" text-center text-2xl font-bold mb-4">Financial Data Filtering & Sorting App</h1>

      {/* Filter Section */}
      <div className="filter-section p-4 bg-gray-100 rounded-md mb-6">
        <h2 className="text-lg font-semibold">Filter Data</h2>

        {/* Date Range */}
        <div className="my-2">
          <label className="block font-medium">Date Range:</label>
          <input
            type="text"
            placeholder="Start Year (e.g., 2020)"
            className="border px-2 py-1 mr-2"
            value={minDate}
            onChange={(e) => setMinDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="End Year (e.g., 2024)"
            className="border px-2 py-1"
            value={maxDate}
            onChange={(e) => setMaxDate(e.target.value)}
          />
        </div>

        {/* Revenue Range */}
        <div className="my-2">
          <label className="block font-medium">Revenue Range:</label>
          <input
            type="number"
            placeholder="Min Revenue"
            className="border px-2 py-1 mr-2"
            value={minRevenue}
            onChange={(e) => setMinRevenue(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Revenue"
            className="border px-2 py-1"
            value={maxRevenue}
            onChange={(e) => setMaxRevenue(e.target.value)}
          />
        </div>

        {/* Net Income Range */}
        <div className="my-2">
          <label className="block font-medium">Net Income Range:</label>
          <input
            type="number"
            placeholder="Min Net Income"
            className="border px-2 py-1 mr-2"
            value={minNetIncome}
            onChange={(e) => setMinNetIncome(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Net Income"
            className="border px-2 py-1"
            value={maxNetIncome}
            onChange={(e) => setMaxNetIncome(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container overflow-auto p-4 ">
        <table className="table-auto w-full border-collapse border border-gray-400 shadow-md rounded-1g">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold sticky top-0">
                Date
                <button
                  onClick={() => {
                    setSortField("date");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                  className="ml-2 text-blue-500"
                >
                  {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold sticky top-0">
                Revenue
                <button
                  onClick={() => {
                    setSortField("revenue");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                  className="ml-2 text-blue-500"
                >
                  {sortField === "revenue" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold sticky top-0">
                Net Income
                <button
                  onClick={() => {
                    setSortField("netIncome");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                  className="ml-2 text-blue-500"
                >
                  {sortField === "netIncome" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold sticky top-0">Gross Profit</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold sticky top-0">EPS</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold sticky top-0">Operating Income</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((item) => (
                <tr key={item.date} className="even:bg-gray-300 odd:bg-white">
                  <td className="border border-gray-300 px-4 py-2">{item.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.revenue}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.netIncome}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.grossProfit}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.eps}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.operatingIncome}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No data matches your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;