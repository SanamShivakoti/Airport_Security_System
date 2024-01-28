// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const userAuthApi = createApi({
  reducerPath: "userAuthApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/admin/" }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: ({ actualData, access_token }) => {
        return {
          url: "register/user/",
          method: "POST",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
            "Content-type": "application/json",
          },
        };
      },
    }),
    loginUser: builder.mutation({
      query: (user) => {
        return {
          url: "login/",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    getUsers: builder.query({
      query: ({ access_token }) => {
        return {
          url: "users_list/",
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    AdminProfileView: builder.query({
      query: ({ access_token }) => {
        return {
          url: "profile/",
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    filterUsers: builder.query({
      query: ({ user_id, access_token }) => {
        return {
          url: `user_filter/${user_id}/`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
            "Content-type": "application/json",
          },
        };
      },
    }),
    DeleteUser: builder.mutation({
      query: ({ user_id, access_token }) => {
        return {
          url: `user_delete/${user_id}/`,
          method: "DELETE",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    updateUserProfile: builder.mutation({
      query: ({ user_id, formData, access_token }) => {
        return {
          url: `user_update/profile/${user_id}/`,
          method: "PATCH",
          body: formData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    updateUser: builder.mutation({
      query: ({ user_id, actualData, access_token }) => {
        return {
          url: `user_update/${user_id}/`,
          method: "PATCH",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
            "Content-type": "application/json",
          },

          formData: true,
        };
      },
    }),
    SendOTP: builder.mutation({
      query: ({ access_token }) => {
        return {
          url: "send_otp_email/",
          method: "POST",
          headers: {
            authorization: `Bearer ${access_token}`,
            "Content-type": "application/json",
          },
        };
      },
    }),
    VerifyOTP: builder.mutation({
      query: ({ access_token, otp }) => {
        return {
          url: "otp_verification/",
          method: "POST",
          body: { otp },
          headers: {
            authorization: `Bearer ${access_token}`,
            "Content-type": "application/json",
          },
        };
      },
    }),
    ResetPassword: builder.mutation({
      query: ({ actualData, access_token }) => {
        return {
          url: "change_password/",
          method: "PUT",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
            "Content-type": "application/json",
          },
        };
      },
    }),
    openCamera: builder.mutation({
      query: () => {
        return {
          url: "passport_scan/",
          method: "GET",
          headers: {
            // authorization: `Bearer ${access_token}`,
            "Content-type": "application/json",
          },
        };
      },
    }),
    registerPassenger: builder.mutation({
      query: ({ actualData, access_token }) => {
        return {
          url: "register/passenger/",
          method: "POST",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
            "Content-type": "application/json",
          },
        };
      },
    }),
    getPassengers: builder.query({
      query: ({ access_token }) => {
        return {
          url: "passengers_list/",
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    filterPassengers: builder.query({
      query: ({ passenger_id, access_token }) => {
        return {
          url: `passenger_filter/${passenger_id}/`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
            "Content-type": "application/json",
          },
        };
      },
    }),
    updatePassenger: builder.mutation({
      query: ({ passenger_id, actualData, access_token }) => {
        return {
          url: `passenger_update/${passenger_id}/`,
          method: "PATCH",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
            "Content-type": "application/json",
          },

          formData: true,
        };
      },
    }),
    DeletePassenger: builder.mutation({
      query: ({ passenger_id, access_token }) => {
        return {
          url: `passengers_delete/${passenger_id}/`,
          method: "DELETE",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    registerStaff: builder.mutation({
      query: ({ data, access_token }) => {
        return {
          url: `register/Staff/`,
          method: "POST",
          body: data,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    getStaffs: builder.query({
      query: ({ access_token }) => {
        return {
          url: "staffs_list/",
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    DeleteStaff: builder.mutation({
      query: ({ staff_id, access_token }) => {
        return {
          url: `staffs_delete/${staff_id}/`,
          method: "DELETE",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    filterStaffs: builder.query({
      query: ({ staff_id, access_token }) => {
        return {
          url: `staffs_filter/${staff_id}/`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
            "Content-type": "application/json",
          },
        };
      },
    }),
    updateStaff: builder.mutation({
      query: ({ staff_id, actualData, access_token }) => {
        return {
          url: `staffs_update/${staff_id}/`,
          method: "PATCH",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
            "Content-type": "application/json",
          },
        };
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUsersQuery,
  useAdminProfileViewQuery,
  useFilterUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useSendOTPMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useOpenCameraMutation,
  useUpdateUserProfileMutation,
  useRegisterPassengerMutation,
  useGetPassengersQuery,
  useFilterPassengersQuery,
  useUpdatePassengerMutation,
  useDeletePassengerMutation,
  useRegisterStaffMutation,
  useGetStaffsQuery,
  useDeleteStaffMutation,
  useFilterStaffsQuery,
  useUpdateStaffMutation,
} = userAuthApi;
