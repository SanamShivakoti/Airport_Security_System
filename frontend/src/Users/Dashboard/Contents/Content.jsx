import React, { useState, useEffect } from "react";
import {
  useGetPassengersQuery,
  useGetUserNotificationsQuery,
  useUpdateNotificationsMutation,
} from "../../../services/userAuthApi";
import { getToken } from "../../../services/LocalStorageService";
function Content() {
  const { access_token } = getToken();
  const {
    data: passengers = [],
    error,
    isloading,
  } = useGetPassengersQuery({ access_token });

  const totalpassengers = passengers.length;

  const { data: notifications = [], refetch } = useGetUserNotificationsQuery({
    access_token,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 60000); // Refetch every 1 minute

    return () => clearInterval(interval);
  }, []);
  const [loading, setLoading] = useState(false);
  const [handleUpdateNotificatios] = useUpdateNotificationsMutation();
  const renderNotifications = () => {
    const handleClickNotification = async (notification_id, access_token) => {
      console.log("Clicked");
      try {
        setLoading(true);
        // Call the API function to update notification status
        const response = await handleUpdateNotificatios({
          notification_id,
          access_token,
        });
        refetch();
      } catch (error) {
        console.error("Error updating notification:", error);
      } finally {
        setLoading(false);
      }
    };

    // Sort notifications array based on the checked status
    const sortedNotifications = [...notifications].sort((a, b) => {
      if (a.checked === b.checked) {
        return 0;
      }
      // Move unchecked notifications (checked: false) to the top
      return a.checked ? 1 : -1;
    });

    return (
      <div
        className="notifications-container"
        style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
      >
        {sortedNotifications.map((notification, index) => {
          const isNewNotification = !notification.checked;
          const notificationStyle = isNewNotification
            ? { color: "red", fontWeight: "normal" }
            : { color: "black", fontWeight: "normal" };

          return (
            <div
              key={index}
              className={`desktop:mx-1 my-1 desktop:py-2 laptop:mx-2 my-2 laptop:py-4 text-left tablet:py-1 tablet:mx-1 hover:bg-gray-200 group`}
              onClick={() =>
                handleClickNotification(
                  notification.notification_id,
                  access_token
                )
              } // Pass notification ID to the click handler
              style={{
                cursor: notification.checked ? "auto" : "pointer",
              }}
            >
              <div className="flex items-center">
                <div className="text-blue-600 visited:text-purple-600 font-bold text-lg mr-2">
                  {notification.notification_name}
                </div>
                {isNewNotification && (
                  <span className="rounded-full bg-red-500 text-white px-1 py-0.5 text-xs">
                    New
                  </span>
                )}
              </div>
              <p style={notificationStyle}>
                {notification.notification_description}
              </p>
              {isNewNotification && (
                <div className="absolute hidden group-hover:flex bg-gray-100 p-2 rounded-lg text-xs">
                  Click to checkout
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="flex h-screen">
      {/* for Dashboard-contents */}
      <div className="flex-auto laptop:w-9/12 ml-1 mr-1 bg-zinc-100 tablet:w-8/12">
        <div className="text-3xl font-bold text-left mt-1 mb-1 ml-1">
          Dashboard
        </div>
        <hr className="border-t-2 border-solid border-black my-1" />
        <div className="flex desktop:mx-48 desktop:w-6/12 laptop:mx-32 laptop:w-3/5 tablet:mx-10 tablet:w-4/5">
          {/* for total passengers */}
          <div className="flex-1  mx-20 my-10 h-auto border-2 border-black rounded bg-zinc-300 shadow-lg tablet:mx-10">
            <div className="text-3xl font-bold mx-4 my-4 px-4 py-4 ">
              Total Passengers
              <div className="text-2xl font-bold mx-4 my-4 px-4 ">
                {totalpassengers}
              </div>
            </div>
          </div>
        </div>
        {/* for Activities */}
        <div className="text-2xl text-left font-bold mt-1 mb-1 ml-5">
          Activities
        </div>
        <div className="font-bold-none bg-slate-300 rounded w-11/12 h-96 border-2 border-black mt-1 mb-1 ml-4 shadow-lg">
          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 pt-2 pb-1">
            This is the First line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Second line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Third line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Fourth line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Fifth line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Sixth line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Seventh line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Eight line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Ninth line
          </p>
        </div>
      </div>
      {/* For Notifications */}
      <div className="flex-auto w-3/12 mr-1 bg-zinc-100">
        <div className="text-3xl font-bold text-center mt-1 mb-1 ml-2">
          Notifications
        </div>
        <hr className="border-t-2 border-black my-1" />
        <div className="laptop:text-sm desktop:text-base tablet:text-sm">
          {renderNotifications()}
        </div>
      </div>
    </div>
  );
}

export default Content;
