// Need to use the React-specific entry point to allow generating React hooks

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const AclAPISlice = createApi({
	reducerPath: 'AclAPI',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_APP_API_URL }),

	refetchOnReconnect: true,

	tagTypes: [
		'Acl'
	],

	endpoints: (builder) => ({
		
		createRole: builder.mutation({
			query(body) {
				return {
					url: `/role`,
					method: 'POST',
					body,
				}
			},
			invalidatesTags:['Acl']
		}),
		createPermission: builder.mutation({
			query(body) {
				return {
					url: `/permission`,
					method: 'POST',
					body,
				}
			},
			invalidatesTags:['Acl']
		}),
		
		getAllRole: builder.query({
			query: () => {
				return {
					url: `/role`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			providesTags: (result) => {
				const defaultTag = { type: 'Acl', id: 'NEW' }

				return result
					? [ ...result.map(({ id }) => ({ type: 'Acl', id: id })), defaultTag ]
					: [defaultTag]
			}
		}),
		

		createRolePermission: builder.mutation({
			query(body) {
				return {
					url: `/rolePermissions`,
					method: 'POST',
					body,
				}
			},
			invalidatesTags:['Acl']
		}),
		
		deleteRolePermission: builder.mutation({
			query(body) {
				return {
					url: `/rolePermissions`,
					method: 'POST',
					body,
				}
			},
			invalidatesTags:['Acl']
		}),


		getAllPermission: builder.query({
			query: () => {
				return {
					url: `/permission`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			invalidatesTags:['Acl']
		}),

		// getAuthUserAclAccessData

	}),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
	useCreateRoleMutation,
	useCreatePermissionMutation,
	useGetAllRoleQuery,
	useGetAllPermissionQuery,
	useCreateRolePermissionMutation,
	useDeleteRolePermissionMutation,
} = AclAPISlice;
