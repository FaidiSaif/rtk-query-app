import {
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserType } from "../types";



const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState(); 

export const usersSlice = createApi({
  reducerPath: 'users', 
  baseQuery : fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
  tagTypes  : ['Users'], 
  endpoints : builder => ({

    getUsers : builder.query<UserType[], void>({
      query : () => '/users', 
      providesTags: ['Users']
    }), 
    
  })
})

export const { useGetUsersQuery } = usersSlice; 
export const usersResultQuerySelector = usersSlice.endpoints.getUsers.select() ; 
export const selectUsersData = createSelector(usersResultQuerySelector, usersResult => usersResult.data)

// export const {
//   selectAll: selectAllUsers,
//   selectById: selectUserById,
//   selectIds: selectUserIds
//   // Pass in a selector that returns the posts slice of state
// } = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)
