import { useNavigate } from "react-router-dom";
import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { useOpenCameraMutation } from "../../services/userAuthApi";

function StaffsRegistration() {
  // const [openCamera, { isLoading, isError, error }] = useOpenCameraMutation();

  const [openCamera] = useOpenCameraMutation();

  // function to open camera

  const handleOpenCamera = async () => {
    try {
      // Trigger the openCamera mutation
      const result = await openCamera();
      // Handle success if needed
      console.log("Camera opened successfully", result);
    } catch (error) {
      // Handle error if needed
      console.error("Error opening camera", error);
    }
  };

  const navigate = useNavigate();
  return (
    <div>
      <div className="text-3xl font-bold text-center">Staffs Details</div>
      <div className="mt-8 ">
        <form>
          <div className="grid w-auto grid-cols-2 gap-4 laptop:px-40 desktop:px-52  tablet:px-32">
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
                  name="first-name"
                  id="first-name"
                  placeholder="First Name"
                  autoComplete="given-name"
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
                  name="middle-name"
                  id="middle-name"
                  placeholder="Middle Name"
                  autoComplete="given-name"
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
                  name="last-name"
                  id="last-name"
                  placeholder="Last Name"
                  autoComplete="given-name"
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
                  name="mobile"
                  id="mobile"
                  placeholder="Mobile Number"
                  autoComplete="given-name"
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
            {/* To display photo */}
            <div className="relative ">
              <div className="absolute top-0 right-0">
                <div className=" mt-4 px-4 bg-white w-60 h-60 mx-auto p-4 border-4 border-gray-300 rounded-md">
                  <label
                    htmlFor="photo"
                    className="block ml-1 text-sm text-center font-medium leading-6 text-gray-900"
                  >
                    Photo
                  </label>
                </div>

                <button className="w-40 mt-4" onClick={handleOpenCamera}>
                  Open Camera
                </button>
              </div>
            </div>
          </div>

          <p className="desktop:mt-24 laptop:mt-14 tablet:mt-14 flex text-base  laptop:px-40 desktop:px-52  tablet:px-32">
            Note: Staff ID will be auto generate by system. It will be a
            alphanumeric value of six characters.
          </p>

          <div className="desktop:mt-24 laptop:mt-14 tablet:mt-14 flex items-center justify-end gap-x-6 laptop:px-40 desktop:px-52  tablet:px-32">
            <button
              type="button"
              onClick={() => navigate("/Admin/Staff/View/details/")}
              className="rounded-md bg-indigo-600 w-[36rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              View Staffs
            </button>

            <button
              type="submit"
              className="rounded-md bg-lime-700 w-[36rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
            >
              Register Staffs
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaffsRegistration;
