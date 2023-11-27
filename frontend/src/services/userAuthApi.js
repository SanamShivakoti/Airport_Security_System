// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/admin/'}),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query:({ actualData, access_token })=>{
          return{
              url:'register/user/',
              method:'POST',
              body: actualData,
              headers:{
                'authorization':`Bearer ${access_token}`,
                'Content-type':'application/json'
                
              }
          }
      }
    }),
    loginUser: builder.mutation({
      query:(user)=>{
        return{
          url:'login/',
          method: 'POST',
          body: user,
          headers:{
            'Content-type':'application/json'
          }
        }
      }
    }),
    getUsers: builder.query({
      query:({ access_token })=>{
          return{
              url:'users_list/',
              method:'GET',
              headers:{
                'authorization':`Bearer ${access_token}`
              }
          }
      }
    }),
    AdminProfileView: builder.query({
      query:({ access_token })=>{
          return{
              url:'profile/',
              method:'GET',
              headers:{
                'authorization':`Bearer ${access_token}`
              }
          }
      }
    }),
    filterUsers: builder.query({
      query:({ user_id,access_token})=>{
  
          return{
              url:`user_filter/${user_id}/`,
              method:'GET',
              headers:{
                'authorization':`Bearer ${access_token}`,
                'Content-type':'application/json'
                
              }
              
          }
          
      }
    }),
    DeleteUser: builder.mutation({
      query:({user_id, access_token})=>{
         
        return{
          url:`user_delete/${user_id}/`,
          method: 'DELETE',
          headers:{
            'authorization':`Bearer ${access_token}`
          }
        }
      }
    }),
    updateUser: builder.mutation({
      query:({ user_id, actualData, access_token })=>{
          return{
              url:`user_update/${user_id}/`,
              method:'PATCH',
              body: actualData,
              headers:{
                'authorization':`Bearer ${access_token}`,
                'Content-type':'application/json'
                
              }
          }
      }
    }),
    SendOTP: builder.mutation({
      query:({ access_token })=>{
          return{
              url:'send_otp_email/',
              method:'POST',
              headers:{
                'authorization':`Bearer ${access_token}`,
                'Content-type':'application/json'
                
              }
          }
      }
    }),
    VerifyOTP: builder.mutation({
      query:({ access_token, otp})=>{
          return{
              url:'otp_verification/',
              method:'POST',
              body:{otp},
              headers:{
                'authorization':`Bearer ${access_token}`,
                'Content-type':'application/json'
                
              }
          }
      }
    }),
    ResetPassword: builder.mutation({
      query:({ actualData, access_token })=>{
          return{
              url:'change_password/',
              method:'PUT',
              body:actualData,
              headers:{
                'authorization':`Bearer ${access_token}`,
                'Content-type':'application/json'
                
              }
          }
      }
    }),

  }),
})

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
  useResetPasswordMutation} = userAuthApi