import React, { useState, useMemo } from "react";
import { useGetUsersQuery } from "../../../services/userAuthApi";
import { getToken } from "../../../services/LocalStorageService";
import axios from "axios";

function ViewUsers() {
  const [userIdSearch, setUserIdSearch] = useState("");
  const [serverError, setServerError] = useState({});
  const [successMessage, setSuccessMessage] = useState({});
  const { access_token } = getToken();

  // Fetch users data using the useGetUsersQuery hook
  const { data: users = [], error, isLoading } = useGetUsersQuery({
    access_token,
  });

  // Memoized filtering of users based on search input
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.user_id.toLowerCase().includes(userIdSearch.toLowerCase())
    );
  }, [users, userIdSearch]);

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setUserIdSearch(e.target.value);
  };

  const handleDelete = async (user_id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/admin/user_delete/${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (response.data.error) {
        console.error("Error deleting user:", response.error);
        setServerError(response.data.error);
      } else if (response.data.msg) {
        setSuccessMessage(response.data.msg);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading users: {error}</div>;
  }

  return (
    <div>
      <div className="text-3xl flex justify-center font-bold pt-2">
        View Users
      </div>
      <div className="pl-64 pr-2">
        <div className="mb-4 mt-10">
          {/* Search input */}
          <input
            type="text"
            name="user_id"
            placeholder="Search by User ID"
            className="border rounded-md px-2 py-2 w-1/4"
            value={userIdSearch}
            onChange={handleSearchChange}
          />
        </div>

        <div className="overflow-x-auto overflow-y-auto">
          <table className="min-w-full border-collapse table-auto">
            <thead>
              <tr>
                <th className="px-1 py-2 w-1/12 text-left bg-gray-300">SN</th>
                <th className="px-1 py-2 w-1/4 text-center bg-gray-300">
                  User Name
                </th>
                <th className="px-1 py-2 w-1/6 text-center bg-gray-300">
                  User ID
                </th>
                <th className="px-1 py-2 text-center bg-gray-300">Role</th>
                <th className="px-1 py-2 text-center bg-gray-300">Status</th>
                <th className="px-1 py-2 text-center bg-gray-300">Edit</th>
                <th className="px-1 py-2 text-center bg-gray-300">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.user_id}
                  className="table-row group hover:bg-yellow-200 hover:cursor-pointer"
                  data-row-id={user.id}
                >
                  <td className="border px-1 py-1 w-1/12">{index + 1}</td>
                  <td className="border px-1 py-1 w-1/4">{`${user.first_name} ${user.middle_name} ${user.last_name}`}</td>
                  <td className="border px-1 py-1 w-1/12">{user.user_id}</td>
                  <td className="border px-1 py-1 w-1/12">{user.role}</td>
                  <td className="border px-1 py-1 w-1/12">{user.status}</td>
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
                      onClick={() => handleDelete(user.user_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewUsers;
