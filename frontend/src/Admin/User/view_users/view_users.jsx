import React, { useState } from "react";

function ViewUsers() {
  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <div className="text-3xl flex justify-center font-bold pt-2">
        View Users
      </div>
      <div className="pl-64 pr-2">
        <div className="mb-4 mt-10">
          {/* Add margin-bottom to create space between search and table */}
          {/* Search input */}
          <input
            type="text"
            placeholder="Search by User ID or User Name"
            className="border rounded-md px-2 py-2 w-1/4" // Adjust width as needed
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {/* Search button */}
          <button
            type="button"
            className="rounded-md bg-blue-500 text-white px-2 py-2 ml-2 w-44" // Add margin-left for spacing
          >
            Search
          </button>
        </div>

        <div className="overflow-x-auto overflow-y-auto">
          <table className="min-w-full border-collapse table-auto">
            <thead>
              <tr>
                <th className="px-1 py-2  w-1/12text-left bg-gray-300">SN</th>
                <th className="px-1 py-2  w-1/4text-center bg-gray-300">
                  User Name
                </th>
                <th className="px-1 py-2  w-1/6text-center bg-gray-300">
                  User ID
                </th>
                <th className="px-1 py-2 text-center bg-gray-300">Password</th>
                <th className="px-1 py-2 text-center bg-gray-300">Edit</th>
                <th className="px-1 py-2 text-center bg-gray-300">Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className="table-row group hover:bg-yellow-200 hover:cursor-pointer"
                data-row-id="1"
              >
                <td className="border px-1 py-1 w-1/12">1</td>
                <td className="border px-1 py-1 w-1/4">Row 1, Cell 2</td>
                <td className="border px-1 py-1 w-1/6">Row 1, Cell 3</td>
                <td className="border px-1 py-1">Row 1, Cell 4</td>
                <td className="border px-1 py-1">
                  <button
                    type="button"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Edit
                  </button>
                </td>
                <td className="border px-1 py-1">
                  <button
                    type="submit"
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr
                className="table-row group hover:bg-yellow-200 hover:cursor-pointer"
                data-row-id="2"
              >
                <td className="border px-1 py-1 w-1/12">2</td>
                <td className="border px-1 py-1 w-1/4">Row 2, Cell 2</td>
                <td className="border px-1 py-1 w-1/6">Row 2, Cell 3</td>
                <td className="border px-1 py-1">Row 2, Cell 4</td>
                <td className="border px-1 py-1">
                  <button
                    type="button"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Edit
                  </button>
                </td>
                <td className="border px-1 py-1">
                  <button
                    type="submit"
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewUsers;
