// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {socket} from "@/socket/socket";

// Define a service using a base URL and expected endpoints
export const AuthorizationApiSlice = createApi({
	reducerPath: 'AuthorizationApi',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_APP_API_URL }),

	refetchOnReconnect: true,

	tagTypes: ['Roles','Permissions'],

	endpoints: (builder) => ({
		getRoles: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/authorization/roles?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			providesTags: (result) => {
				const defaultTag = { type: 'Roles', id: 'NEW' }

				return result
					? [
						...result.map(({ _id }) => ({ type: 'Roles', id: _id })),
						defaultTag,
					]
					: [defaultTag]
			}
		}),
		
		getPermissions: builder.query({
			// new UserACLManager
			
			query: (params) => {
				// const queryString = new URLSearchParams(params).toString();
				return {
					url: `/permission`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			providesTags: (result) => {
				const defaultTag = { type: 'Permissions', id: 'NEW' }

				return result
					? [
						...result.map(({ _id }) => ({ type: 'Permissions', id: _id })),
						defaultTag,
					]
					: [defaultTag]
			}
		}),

		createRole: builder.mutation({
			query(body) {
				return {
					url: `/authorization/roles`,
					method: 'POST',
					body,
				}
			},

			invalidatesTags: [{ type: 'Roles', id: 'NEW' }],
		})
	}),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
	useGetRolesQuery,
	useGetPermissionsQuery,
	useCreateRoleMutation,
} = AuthorizationApiSlice;
