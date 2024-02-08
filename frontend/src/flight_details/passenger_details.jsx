import React, { useState, useRef, useEffect } from "react";

import {
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const PassengerDetails = () => {
  // State variables
  const [firstName, setFirstName] = useState("N/A");
  const [middleName, setMiddleName] = useState("N/A");
  const [lastName, setLastName] = useState("N/A");
  const [email, setEmail] = useState("N/A");
  const [mobile, setMobile] = useState("N/A");
  const [flightNumber, setFlightNumber] = useState("N/A");
  const [planeNumber, setPlaneNumber] = useState("N/A");
  const [fromDestination, setFromDestination] = useState("N/A");
  const [toDestination, setToDestination] = useState("N/A");
  const [duration, setDuration] = useState("N/A");
  const [departureDate, setDepartureDate] = useState("N/A");
  const [departureTime, setDepartureTime] = useState("--:--:--");
  const [arrivalDate, setArrivalDate] = useState("N/A");
  const [arrivalTime, setArrivaelTime] = useState("--:--:--");
  const [bookedDate, setBookedDate] = useState("N/A");
  const [bookedTime, setBookedTime] = useState("--:--:--");
  const [entryTime, setEntryTime] = useState("--:--:--");

  const [passportNumber, setPassportNumber] = useState(null);
  const [isDepartureToday, setIsDepartureToday] = useState(false);
  const [isEntryAllowed, setIsEntryAllowed] = useState(false);

  const [remainingTime, setRemainingTime] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogVisibilityDuration, setDialogVisibilityDuration] =
    useState(60000);

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://192.168.25.25:8000/practice");
    // ws.current = new WebSocket("ws://127.0.0.1:8000/practice");

    ws.current.onopen = () => {
      console.log("Web Socket Opened");
    };

    ws.current.onmessage = (event) => {
      // Handle incoming messages from the server
      console.log("Received message:", event.data);

      const data = JSON.parse(event.data);
      const receivedPassportNumber = data.type;
      if (receivedPassportNumber === "passportNumber") {
        const newpassportNumber = data.id_number;
        setPassportNumber(newpassportNumber);
      }
    };

    ws.current.onclose = () => {
      console.log("Web Socket Closed");
    };

    return () => {
      // Clean up the WebSocket connection when the component is unmounted
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    // Ensure passportNumber is truthy before making the API call
    if (passportNumber) {
      fetchData();
    }
  }, [passportNumber]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/admin/passenger/${encodeURIComponent(
          passportNumber
        )}/`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        const serverError = await res.json();
        console.error("Error in response:", serverError.detail);
        setError(serverError.detail);

        setTimeout(() => {
          setError(null);
        }, 1 * 60 * 1000);
      } else {
        const result = await res.json();
        setResult(result);
        setError(null);
        setFirstName(result.first_name);
        setMiddleName(result.middle_name);
        setLastName(result.last_name);
        setEmail(result.email);
        setMobile(result.mobile_number);
        setFlightNumber(result.flight_number);
        setPlaneNumber(result.plane_number);
        setFromDestination(result.flight_Destination_from);
        setToDestination(result.flight_Destination_to);
        setDuration(result.flight_Destination_Duration);
        setDepartureDate(result.depature_date);
        setPassportNumber(result.passport_number);

        // Separate and format arrival date and time
        const arrivalDateTime = new Date(result.arrival_time);
        const formattedArrivalDate = arrivalDateTime.toLocaleDateString();
        const formattedArrivalTime = arrivalDateTime.toLocaleTimeString();
        // Separate and format departure date and time
        const departureDateTime = new Date(result.depature_time);
        const formattedDepartureDate = departureDateTime.toLocaleDateString();
        const formattedDepartureTime = departureDateTime.toLocaleTimeString();
        const durationInMilliseconds = arrivalDateTime - departureDateTime;
        const durationInHours = durationInMilliseconds / (1000 * 60 * 60);
        // Separate and format booked date and time
        const bookedDateTime = new Date(result.booked_Time);
        const formattedBookedDate = bookedDateTime.toLocaleDateString();
        const formattedBookedTime = bookedDateTime.toLocaleTimeString();
        // Set the state with the formatted values
        setArrivalDate(formattedArrivalDate);
        setArrivaelTime(formattedArrivalTime);
        setDepartureDate(formattedDepartureDate);
        setDepartureTime(formattedDepartureTime);
        setBookedDate(formattedBookedDate);
        setBookedTime(formattedBookedTime);
        setDuration(durationInHours.toFixed(2) + "hrs");

        // Check if departure date is today
        const today = new Date();

        console.log("depature date", departureDateTime.toTimeString());
        console.log("today date", today.toTimeString());
        if (departureDateTime.toDateString() === today.toDateString()) {
          setIsDepartureToday(true);

          // Check if departure time is in the future
          const departureDateTime = new Date(
            `${formattedDepartureDate} ${formattedDepartureTime}`
          );
          console.log("formated data and time", departureDateTime);

          if (today < departureDateTime) {
            const timeDiffInMilliseconds = departureDateTime - today;
            console.log("time different", timeDiffInMilliseconds);
            const timeDiffInHours = timeDiffInMilliseconds / (1000 * 60 * 60);
            console.log("time different in hours", timeDiffInHours);

            if (timeDiffInHours > 2) {
              // Entry not allowed, show remaining time
              setIsEntryAllowed(false);
              setRemainingTime(timeDiffInHours.toFixed(2));
            } else if (timeDiffInHours <= 2 && timeDiffInHours > 0) {
              // Entry allowed
              setIsEntryAllowed(true);
            }
          } else {
            // Departure time has already passed
            setDialogMessage(
              "Your flight has already been missed. Please contact the concerned authority for reschedule."
            );
            setShowDialog(true);

            // Automatically close the dialog after the specified duration
            setTimeout(() => {
              setShowDialog(false);
            }, dialogVisibilityDuration);
            setIsEntryAllowed(false);
          }
        } else {
          // Departure date is not today
          setIsDepartureToday(false);
          setIsEntryAllowed(false);
        }

        setTimeout(() => {
          setResult(null);
          setError(null);
          setFirstName("N/A");
          setMiddleName("N/A");
          setLastName("N/A");
          setEmail("N/A");
          setMobile("N/A");
          setFlightNumber("N/A");
          setPlaneNumber("N/A");
          setFromDestination("N/A");
          setToDestination("N/A");
          setDuration("N/A");
          setDepartureDate("N/A");
          setDepartureTime("--:--:--");
          setArrivalDate("N/A");
          setArrivaelTime("--:--:--");
          setBookedDate("N/A");
          setBookedTime("--:--:--");
          setPassportNumber(null);
          setIsDepartureToday(false);
          setIsEntryAllowed(false);
          setRemainingTime(0);
          setEntryTime("--:--:--");
        }, 1 * 60 * 1000);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sendMessage = (message) => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
      console.log("Message sent:", message);
    } else {
      console.error("WebSocket not open. Failed to send message:", message);
    }
  };

  const handlePassportScan = async () => {
    // Send a message to the WebSocket server (Raspberry Pi)
    sendMessage("passportscan");
  };

  return (
    <div className="container mx-auto mt-4 p-4 bg-gray-200 rounded shadow-md">
      <h1 className="text-4xl mb-4">Passengers Details</h1>

      {error && (
        <div className="flex items-center mb-4">
          <Alert severity="error">{error}</Alert>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
        <div className="mb-2 md:mb-4 flex items-center">
          <label className="font-bold w-1/2 md:w-1/3 text-center">
            First Name:
          </label>
          <p className="text-gray-800 text-center">{firstName}</p>
        </div>
        <div className="mb-2 md:mb-4 flex items-center">
          <label className="font-bold w-1/2 md:w-1/3 text-center">
            Middle Name:
          </label>
          <p className="text-gray-800 text-center">{middleName}</p>
        </div>
        <div className="mb-2 md:mb-4 flex items-center">
          <label className="font-bold w-1/2 md:w-1/3 text-center">
            Last Name:
          </label>
          <p className="text-gray-800 text-center">{lastName}</p>
        </div>
        <div className="mb-2 md:mb-4 flex items-center">
          <label className="font-bold w-1/2 md:w-1/3 text-center">Email:</label>
          <p className="text-gray-800 text-center">{email}</p>
        </div>
        <div className="mb-2 md:mb-4 flex items-center">
          <label className="font-bold w-1/2 md:w-1/3 text-center">
            Mobile No.:
          </label>
          <p className="text-gray-800 text-center">{mobile}</p>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl mb-4">Flight Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
          <div className="mb-2 md:mb-4 flex items-center">
            <label className="font-bold w-1/2 md:w-1/3 text-center">
              Flight Number:
            </label>
            <p className="text-gray-800 text-center">{flightNumber}</p>
          </div>
          <div className="mb-2 md:mb-4 flex items-center">
            <label className="font-bold w-1/2 md:w-1/3 text-center">
              Plane Number:
            </label>
            <p className="text-gray-800 text-center">{planeNumber}</p>
          </div>
          <div className="mb-2 md:mb-4 flex items-center">
            <label className="font-bold w-1/2 md:w-1/3 text-center">
              Booked Date:
            </label>
            <p className="text-gray-800 text-center">{bookedDate}</p>
          </div>
          <div className="mb-2 md:mb-4 flex items-center">
            <label className="font-bold w-1/2 md:w-1/3 text-center">
              Booked Time:
            </label>
            <p className="text-gray-800 text-center">{bookedTime}</p>
          </div>
          <div className="mb-2 md:mb-4 flex items-center">
            <label className="font-bold w-1/2 md:w-1/3 text-center">
              Passport No.:
            </label>
            <p className="text-gray-800 text-center">{passportNumber}</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl mb-4">Flight Destination</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ml-4">
          <div className="mb-2 md:mb-4 flex items-center">
            <label className="font-bold w-1/2 md:w-1/3 text-center">
              From:
            </label>
            <p className="text-gray-800 text-center">{fromDestination}</p>
          </div>
          <div className="mb-2 md:mb-4 flex items-center">
            <label className="font-bold w-1/2 md:w-1/3 text-center">To:</label>
            <p className="text-gray-800 text-center">{toDestination}</p>
          </div>
          <div className="mb-2 md:mb-4 flex items-center">
            <label className="font-bold w-1/2 md:w-1/3 text-center">
              Duration:
            </label>
            <p className="text-gray-800 text-center">{duration}</p>
          </div>
          <div className="mb-2 md:mb-4 flex items-center">
            <label className="font-bold w-1/2 md:w-1/3 text-center">
              Departure Date:
            </label>
            <p className="text-gray-800 text-center">{departureDate}</p>
          </div>
          <div className="mb-2 md:mb-4 flex items-center">
            <label className="font-bold w-1/2 md:w-1/3 text-center">
              Departure Time:
            </label>
            <p className="text-gray-800 text-center">{departureTime}</p>
          </div>
          <div className="mb-2 md:mb-4 flex items-center">
            <label className="font-bold w-1/2 md:w-1/3 text-center">
              Arrival Date:
            </label>
            <p className="text-gray-800 text-center">{arrivalDate}</p>
          </div>
          <div className="mb-2 md:mb-4 flex items-center">
            <label className="font-bold w-1/2 md:w-1/3 text-center">
              Arrival Time:
            </label>
            <p className="text-gray-800 text-center">{arrivalTime}</p>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <div className="mt-4">
        <div className="mb-2 md:mb-4 flex items-center">
          <label className="font-bold w-1/2 md:w-1/3 text-center">
            Entry Time:
          </label>
          {result ? (
            isDepartureToday ? (
              isEntryAllowed ? (
                <p className="text-green-500 text-center">Proceed Further</p>
              ) : (
                <p className="text-red-500 text-center">
                  Remaining Time: {remainingTime} hrs
                </p>
              )
            ) : (
              <p className="text-red-500 text-center">
                Today isn't your departure date and time
              </p>
            )
          ) : (
            <p className="text-gray-800 text-center">{entryTime}</p>
          )}
        </div>
      </div>

      <div className="mt-4 text-center">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handlePassportScan}
        >
          Passport Scan
        </button>
      </div>

      {showDialog && (
        <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
          <DialogTitle>Flight Missed</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default PassengerDetails;
