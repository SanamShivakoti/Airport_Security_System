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
    filterUsers: builder.query({
      query:({ access_token, user_id })=>{
       
          return{
              url:`user_filter/${user_id}/`,
              method:'GET',
              headers:{
                'authorization':`Bearer ${access_token}`
                
              }
              
          }
          
      }
    }),
  }),
})

export const {useRegisterUserMutation, useLoginUserMutation, useGetUsersQuery, useFilterUsersQuery, useDeleteUserMutation} = userAuthApi