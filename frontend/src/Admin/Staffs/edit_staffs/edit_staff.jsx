import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  useFilterStaffsQuery,
  useUpdateStaffMutation,
} from "../../../services/userAuthApi";
import { storeToken, getToken } from "../../../services/LocalStorageService";
function EditStaffs() {
  const [server_error, setServerError] = useState({});
  const formRef = useRef();
  const { access_token } = getToken();
  const { staff_id } = useParams();
  const [updateStaff] = useUpdateStaffMutation();
  const { data, refetch, isLoading } = useFilterStaffsQuery({
    staff_id,
    access_token,
  });
  const [faceUrl, setFaceUrl] = useState("");
  console.log(data);
  const [userData, setUserData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    address: "",
    department: "",
    face_id: "",
    faces: "",
  });

  useEffect(() => {
    refetch();
    if (data) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        first_name: data.first_name || "",
        middle_name: data.middle_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        mobile_number: data.mobile_number || "",
        address: data.address || "",
        department: data.department || "",
        face_id: data.face_id,
        faces: data.faces,
      }));
      setFaceUrl(`http://localhost:8000${data.faces}`);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(formRef.current);
    const actualData = {
      first_name: data.get("first_name"),
      middle_name: data.get("middle_name"),
      last_name: data.get("last_name"),
      email: data.get("email"),
      mobile_number: data.get("mobile_number"),
      address: data.get("address"),
      department: data.get("department"),
      staff_id,
    };
    const res = updateStaff({ staff_id, actualData, access_token });

    if (res.error) {
      setServerError(res.error.data.errors);
    }

    if (res.data) {
      storeToken(res.data.token);
    }
  };
  return (
    <div>
      <div className="text-3xl font-bold text-center">Staffs Details</div>

      <div className="mt-8 ">
        <div className="grid w-auto grid-cols-2 gap-4 laptop:px-40 desktop:px-52  tablet:px-32">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div>
              <div className="mt-4">
                <label
                  htmlFor="first-name"
                  className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                >
                  First name
                </label>

                <input
                  type="text"
                  name="first_name"
                  id="first-name"
                  placeholder="First Name"
                  autoComplete="given-name"
                  value={userData.first_name}
                  onChange={(e) =>
                    setUserData({ ...userData, first_name: e.target.value })
                  }
                  className="block  my-px w-full m-0 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="middle-name"
                  className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                >
                  Middle name
                </label>

                <input
                  type="text"
                  name="middle_name"
                  id="middle-name"
                  placeholder="Middle Name"
                  autoComplete="given-name"
                  value={userData.middle_name}
                  onChange={(e) =>
                    setUserData({ ...userData, middle_name: e.target.value })
                  }
                  className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="last-name"
                  className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                >
                  Last name
                </label>

                <input
                  type="text"
                  name="last_name"
                  id="last-name"
                  placeholder="Last Name"
                  autoComplete="given-name"
                  value={userData.last_name}
                  onChange={(e) =>
                    setUserData({ ...userData, last_name: e.target.value })
                  }
                  className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="email"
                  className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                >
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  autoComplete="given-name"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="mobile no."
                  className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                >
                  Mobile No.
                </label>

                <input
                  type="number"
                  name="mobile_number"
                  id="mobile"
                  placeholder="Mobile Number"
                  autoComplete="given-name"
                  value={userData.mobile_number}
                  onChange={(e) =>
                    setUserData({ ...userData, mobile_number: e.target.value })
                  }
                  className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="Address"
                  className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                >
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Address"
                  autoComplete="given-name"
                  value={userData.address}
                  onChange={(e) =>
                    setUserData({ ...userData, address: e.target.value })
                  }
                  className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="Department"
                  className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                >
                  Department
                </label>

                <select
                  name="department"
                  id="department"
                  autoComplete="department-name"
                  value={userData.department}
                  onChange={(e) =>
                    setUserData({ ...userData, department: e.target.value })
                  }
                  className="block  my-px px-2 w-full bg-white h-9 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option>Department-1</option>
                  <option>Department-2</option>
                  <option>Department-3</option>
                  <option>Department-4</option>
                  <option>Department-5</option>
                </select>
              </div>
            </div>
          </form>
          {/* To display photo */}
          <div className="relative ">
            <div className="absolute top-0 right-0">
              <div className=" mt-4 px-4 bg-white w-60 h-60 mx-auto p-4 border-4 border-gray-300 rounded-md cursor-not-allowed">
                <label
                  htmlFor="photo"
                  className="block ml-1 text-sm text-center font-medium leading-6 text-gray-900"
                >
                  Photo
                </label>
                <img
                  src={faceUrl}
                  alt="Captured face"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="Face ID"
                  className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                >
                  Face ID
                </label>

                <input
                  type="text"
                  name="face_id"
                  id="address"
                  placeholder="Face ID"
                  autoComplete="given-name"
                  value={userData.face_id}
                  onChange={(e) =>
                    setUserData({ ...userData, face_id: e.target.value })
                  }
                  className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="desktop:mt-16 laptop:mt-14 tablet:mt-14 flex items-center justify-end gap-x-6 laptop:px-40 desktop:px-52  tablet:px-32">
          <button
            type="submit"
            onClick={handleSubmit}
            className="rounded-md bg-lime-700 w-[36rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditStaffs;
