import React, { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  useGetPassengersQuery,
  useDeletePassengerMutation,
} from "../../../services/userAuthApi";
import { getToken, removeToken } from "../../../services/LocalStorageService";
import { removeUserToken } from "../../../features/authSlice";
import { useNavigate } from "react-router-dom";
function ViewPassengers() {
  const [userIdSearch, setUserIdSearch] = useState("");
  const { access_token } = getToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: users = [],
    error,
    isLoading,
    refetch,
  } = useGetPassengersQuery({
    access_token,
  });

  useEffect(() => {
    refetch();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user &&
        user.passenger_id &&
        user.passenger_id.toLowerCase().includes(userIdSearch.toLowerCase())
    );
  }, [users, userIdSearch]);

  const [handleDelete, res] = useDeletePassengerMutation();
  if (error) {
    if (error.status === 401) {
      dispatch(removeUserToken());
      removeToken();
      return navigate("/");
    }
  }

  const handleSearchChange = (e) => {
    setUserIdSearch(e.target.value);
  };

  const deletePassenger = async (passenger_id, access_token) => {
    try {
      const response = await handleDelete({ passenger_id, access_token });
      window.location.reload();
    } catch (error) {}
  };

  const handleEditPassenger = async (passenger_id) => {
    navigate(`Edit/${passenger_id}`);
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
        View Passengers
      </div>
      <div className="pl-64 pr-2">
        <div className="mb-4 mt-10">
          {/* Search input */}
          <input
            type="text"
            name="passenger_id"
            placeholder="Search by Passenger ID"
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
                  Passenger Name
                </th>
                <th className="px-1 py-2 w-1/6 text-center bg-gray-300">
                  Passenger ID
                </th>
                <th className="px-1 py-2 text-center bg-gray-300">Email</th>
                <th className="px-1 py-2 text-center bg-gray-300">
                  Passport Number
                </th>
                <th className="px-1 py-2 text-center bg-gray-300">Edit</th>
                <th className="px-1 py-2 text-center bg-gray-300">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.passenger_id}
                  className="table-row group hover:bg-yellow-200 hover:cursor-pointer"
                  data-row-id={user.id}
                >
                  <td className="border px-1 py-1 w-1/12">{index + 1}</td>
                  <td className="border px-1 py-1 w-1/4">{`${user.first_name} ${user.middle_name} ${user.last_name}`}</td>
                  <td className="border px-1 py-1 w-1/12">
                    {user.passenger_id}
                  </td>
                  <td className="border px-1 py-1 w-1/12">{user.email}</td>
                  <td className="border px-1 py-1 w-1/12">
                    {user.passport_number}
                  </td>
                  <td className="border px-1 py-1">
                    <button
                      type="button"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => handleEditPassenger(user.passenger_id)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="border px-1 py-1">
                    <button
                      type="submit"
                      className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      onClick={() => {
                        deletePassenger(user.passenger_id, access_token);
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

export default ViewPassengers;
