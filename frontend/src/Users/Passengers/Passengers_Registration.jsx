import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterPassengerMutation } from "../../services/userAuthApi";
import {
  storeToken,
  getToken,
  removeToken,
} from "../../services/LocalStorageService";
import { removeUserToken } from "../../features/authSlice";
import { useDispatch } from "react-redux";
import { Alert, CircularProgress, Typography } from "@mui/material";
function PassengersRegistration() {
  const dispatch = useDispatch();
  const formRef = useRef();
  const [server_error, setServerError] = useState("");
  const [registerPassenger] = useRegisterPassengerMutation();
  const { access_token } = getToken();
  const [unauthorized, setUnauthorized] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const confirmationMessage = "Are you sure you want to leave this page?";

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    };

    window.onbeforeunload = handleBeforeUnload;

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 10000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const formatToLocalISO = (date, time) => {
    const localDateTime = new Date(`${date} ${time}`);
    return localDateTime.toISOString();
  };
  const resetformFields = () => {
    formRef.current.reset();
  };
  const handlePassengerRegister = async (e) => {
    e.preventDefault();
    setEmptyFields([]);
    setServerError("");
    const data = new FormData(formRef.current);
    const actualData = {
      first_name: data.get("first_name"),
      middle_name: data.get("middle_name"),
      last_name: data.get("last_name"),
      email: data.get("email"),
      mobile_number: data.get("mobile_number"),
      flight_number: data.get("flight_number"),
      plane_number: data.get("plane_number"),
      booked_Date: data.get("booked_Date"),
      booked_Time: data.get("booked_Time"),
      passport_number: data.get("passport_number"),
      flight_Destination_from: data.get("flight_Destination_from"),
      flight_Destination_to: data.get("flight_Destination_to"),
      depature_date: data.get("depature_date"),
      depature_time: data.get("depature_time"),
      arrival_date: data.get("arrival_date"),
      arrival_time: data.get("arrival_time"),
    };

    // Check if any required fields are empty
    const requiredFields = [
      { name: "first_name", label: "First Name" },
      { name: "last_name", label: "Last Name" },
      { name: "email", label: "Email" },
      { name: "flight_number", label: "Flight Number" },
      { name: "plane_number", label: "Plane Number" },
      { name: "booked_Date", label: "Booked Date" },
      { name: "booked_Time", label: "Booked Time" },
      { name: "passport_number", label: "Passport Number" },
      { name: "flight_Destination_from", label: "Flight Destination From" },
      { name: "flight_Destination_to", label: "Flight Destination To" },
      { name: "depature_date", label: "Departure Date" },
      { name: "depature_time", label: "Departure Time" },
      { name: "arrival_date", label: "Arrival Date" },
      { name: "arrival_time", label: "Arrival Time" },
    ];

    const emptyFields = requiredFields.filter(
      ({ name }) => actualData[name] === ""
    );

    if (emptyFields.length > 0) {
      setEmptyFields(emptyFields.map(({ name }) => name));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = data.get("email");
    if (!emailRegex.test(email)) {
      setServerError("Invalid email format");
      return;
    }

    const mobileNumber = data.get("mobile_number");
    if (mobileNumber) {
      if (mobileNumber.length !== 10) {
        setServerError("Mobile number must be 10 digits long");
        return;
      }
    }
    actualData.booked_Date = new Date(actualData.booked_Date)
      .toISOString()
      .split("T")[0];
    actualData.depature_date = new Date(actualData.depature_date)
      .toISOString()
      .split("T")[0];
    actualData.arrival_date = new Date(actualData.arrival_date)
      .toISOString()
      .split("T")[0];

    actualData.booked_Time = formatToLocalISO(
      actualData.booked_Date,
      actualData.booked_Time
    );
    actualData.depature_time = formatToLocalISO(
      actualData.depature_date,
      actualData.depature_time
    );
    actualData.arrival_time = formatToLocalISO(
      actualData.arrival_date,
      actualData.arrival_time
    );

    const res = await registerPassenger({ actualData, access_token });

    if (res.error) {
      if (res.error.status === 401) {
        setUnauthorized(true);
      }
      setServerError(res.error.data.detail);
    }

    if (res.data) {
      resetformFields();
      setSuccessMessage(res.data.msg);
      storeToken(res.data.token);
    }
  };

  useEffect(() => {
    if (unauthorized) {
      dispatch(removeUserToken());
      removeToken();
      return navigate("/User/login/");
    }
  }, [unauthorized]);

  const navigate = useNavigate();
  return (
    <div>
      <div className="text-3xl flex justify-center font-bold">
        Passengers Details
      </div>
      {server_error && (
        <div className="flex items-center mb-4">
          <Alert severity="error">{server_error}</Alert>
        </div>
      )}
      {successMessage && (
        <div className="flex items-center mb-2">
          <Alert severity="success">{successMessage}</Alert>
        </div>
      )}
      <div className="mt-6 ">
        <form ref={formRef} onSubmit={handlePassengerRegister}>
          <div className="grid w-auto grid-cols-3 gap-4 laptop:px-32 desktop:px-40  tablet:px-24">
            <div className="mt-1">
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
                style={{
                  border: emptyFields.includes("first_name")
                    ? "2px solid red"
                    : "1px solid #D1D5DB",
                }}
                className="block  my-px w-full m-0 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {emptyFields.includes("first_name") && (
                <p className="text-red-500">This field is required</p>
              )}
            </div>

            <div className="mt-1">
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
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mt-1">
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
                style={{
                  border: emptyFields.includes("last_name")
                    ? "2px solid red"
                    : "1px solid #D1D5DB",
                }}
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {emptyFields.includes("last_name") && (
                <p className="text-red-500">This field is required</p>
              )}
            </div>

            <div className="mt-1">
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
                style={{
                  border: emptyFields.includes("email")
                    ? "2px solid red"
                    : "1px solid #D1D5DB",
                }}
                className="block  my-px w-full rounded-md border-0 py-1.5 w-[36rem]text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {emptyFields.includes("email") && (
                <p className="text-red-500">This field is required</p>
              )}
            </div>

            <div className="mt-1">
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
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-4 text-1xl flex justify-center font-bold">
            Flight Details
          </div>

          <div className="mt-2 grid w-auto grid-cols-3 gap-4 laptop:px-32 desktop:px-40  tablet:px-24">
            <div className="mt-1">
              <label
                htmlFor="flight-number"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Flight Number
              </label>

              <input
                type="text"
                name="flight_number"
                id="flight-number"
                placeholder="Flight Number"
                autoComplete="given-name"
                style={{
                  border: emptyFields.includes("flight_number")
                    ? "2px solid red"
                    : "1px solid #D1D5DB",
                }}
                className="block  my-px w-full m-0 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {emptyFields.includes("flight_number") && (
                <p className="text-red-500">This field is required</p>
              )}
            </div>

            <div className="mt-1">
              <label
                htmlFor="plane-number"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Plane Number
              </label>

              <input
                type="text"
                name="plane_number"
                id="plane-number"
                placeholder="Plane Number"
                autoComplete="given-name"
                style={{
                  border: emptyFields.includes("plane_number")
                    ? "2px solid red"
                    : "1px solid #D1D5DB",
                }}
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {emptyFields.includes("plane_number") && (
                <p className="text-red-500">This field is required</p>
              )}
            </div>

            <div className="mt-1">
              <label
                htmlFor="date"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Date
              </label>

              <input
                type="date"
                name="booked_Date"
                id="date"
                placeholder="Date"
                autoComplete="given-name"
                style={{
                  border: emptyFields.includes("booked_Date")
                    ? "2px solid red"
                    : "1px solid #D1D5DB",
                }}
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {emptyFields.includes("booked_Date") && (
                <p className="text-red-500">This field is required</p>
              )}
            </div>

            <div className="mt-1">
              <label
                htmlFor="time"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Time
              </label>

              <input
                type="time"
                name="booked_Time"
                id="time"
                placeholder="Time"
                autoComplete="given-name"
                style={{
                  border: emptyFields.includes("booked_Time")
                    ? "2px solid red"
                    : "1px solid #D1D5DB",
                }}
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {emptyFields.includes("booked_Time") && (
                <p className="text-red-500">This field is required</p>
              )}
            </div>

            <div className="mt-1">
              <label
                htmlFor="passport-number"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Passport No.
              </label>

              <input
                type="text"
                name="passport_number"
                id="passport-number"
                placeholder="Passport Number"
                autoComplete="given-name"
                style={{
                  border: emptyFields.includes("passport_number")
                    ? "2px solid red"
                    : "1px solid #D1D5DB",
                }}
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {emptyFields.includes("passport_number") && (
                <p className="text-red-500">This field is required</p>
              )}
            </div>
          </div>

          <div className="desktop:mt-6 text-sm flex justify-left  laptop:px-32 desktop:px-40  tablet:px-24">
            Flight Destination
          </div>

          <div className="mt-1 flex flex-row justify-left  laptop:px-32 desktop:px-40  tablet:px-24">
            <div className="pr-2 py-1.5">From</div>
            <div className="pr-2">
              <input
                type="text"
                name="flight_Destination_from"
                id="from-destination"
                placeholder="From"
                autoComplete="given-name"
                style={{
                  border: emptyFields.includes("flight_Destination_from")
                    ? "2px solid red"
                    : "1px solid #D1D5DB",
                }}
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {emptyFields.includes("flight_Destination_from") && (
                <p className="text-red-500">This field is required</p>
              )}
            </div>
            <div className="pr-2 py-1.5">To</div>
            <div className="pr-2">
              <input
                type="text"
                name="flight_Destination_to"
                id="to-destination"
                placeholder="To"
                autoComplete="given-name"
                style={{
                  border: emptyFields.includes("flight_Destination_to")
                    ? "2px solid red"
                    : "1px solid #D1D5DB",
                }}
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {emptyFields.includes("flight_Destination_to") && (
                <p className="text-red-500">This field is required</p>
              )}
            </div>
          </div>

          <div className="grid w-auto grid-cols-2 gap-4 laptop:px-32 desktop:px-40 desktop:mt-4 tablet:px-24">
            <div className="mt-4 text-left">
              Depature
              <div className="grid w-auto grid-cols-2 gap-2">
                <div className="pr-2">
                  <input
                    type="date"
                    name="depature_date"
                    id="date"
                    placeholder="Date"
                    autoComplete="given-name"
                    style={{
                      border: emptyFields.includes("depature_date")
                        ? "2px solid red"
                        : "1px solid #D1D5DB",
                    }}
                    className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {emptyFields.includes("depature_date") && (
                    <p className="text-red-500">This field is required</p>
                  )}
                </div>
                <div className="pr-2">
                  <input
                    type="time"
                    name="depature_time"
                    id="time"
                    placeholder="Time"
                    autoComplete="given-name"
                    style={{
                      border: emptyFields.includes("depature_time")
                        ? "2px solid red"
                        : "1px solid #D1D5DB",
                    }}
                    className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {emptyFields.includes("depature_time") && (
                    <p className="text-red-500">This field is required</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 text-left">
              Arrival
              <div className="grid w-auto grid-cols-2 gap-2">
                <div className="pr-2">
                  <input
                    type="date"
                    name="arrival_date"
                    id="date"
                    placeholder="Date"
                    autoComplete="given-name"
                    style={{
                      border: emptyFields.includes("arrival_date")
                        ? "2px solid red"
                        : "1px solid #D1D5DB",
                    }}
                    className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {emptyFields.includes("arrival_date") && (
                    <p className="text-red-500">This field is required</p>
                  )}
                </div>
                <div className="pr-2">
                  <input
                    type="time"
                    name="arrival_time"
                    id="time"
                    placeholder="Time"
                    autoComplete="given-name"
                    style={{
                      border: emptyFields.includes("arrival_time")
                        ? "2px solid red"
                        : "1px solid #D1D5DB",
                    }}
                    className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {emptyFields.includes("arrival_time") && (
                    <p className="text-red-500">This field is required</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="desktop:mt-10 laptop:mt-14 tablet:mt-14 flex text-base  laptop:px-32 desktop:px-40  tablet:px-24">
            Note: Passenger ID will be auto generate by system. It will be a
            alphanumeric value of six characters.
          </p>

          <div className="desktop:mt-7 laptop:mt-14 tablet:mt-14 flex items-center justify-end gap-x-6 laptop:px-32 desktop:px-40  tablet:px-24">
            <button
              type="submit"
              onClick={handlePassengerRegister}
              className="rounded-md bg-lime-700 w-[39rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
            >
              Register Passengers
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PassengersRegistration;
