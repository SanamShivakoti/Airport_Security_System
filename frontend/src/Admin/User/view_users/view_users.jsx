import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../../services/userAuthApi";
import { getToken, removeToken } from "../../../services/LocalStorageService";
import { setUserToken } from "../../../features/authSlice";
import { useNavigate } from "react-router-dom";

function ViewUsers() {
  const [userIdSearch, setUserIdSearch] = useState("");
  const [serverError, setServerError] = useState({});
  const [successMessage, setSuccessMessage] = useState({});
  const { access_token } = getToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: users = [],
    error,
    isLoading,
  } = useGetUsersQuery({
    access_token,
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.user_id.toLowerCase().includes(userIdSearch.toLowerCase())
    );
  }, [users, userIdSearch]);

  const [handleDelete, res] = useDeleteUserMutation();

  if (error) {
    if (error.status === 401) {
      console.log("TOken Expired here");
      dispatch(setUserToken({ access_token: "", isAuthenticated: false }));
      removeToken();
      return navigate("/");
    }
  }

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setUserIdSearch(e.target.value);
  };

  const deleteUser = async (user_id, access_token) => {
    try {
      const response = await handleDelete({ user_id, access_token });
      window.location.reload();
    } catch (error) {}
  };

  const handleEditUser = async (user_id) => {
    navigate(`Edit/${user_id}`);
  };
  if (isLoading || res.isLoading) {
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
                      onClick={() => handleEditUser(user.user_id)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="border px-1 py-1">
                    <button
                      type="submit"
                      className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      onClick={() => {
                        deleteUser(user.user_id, access_token);
                      }}
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
