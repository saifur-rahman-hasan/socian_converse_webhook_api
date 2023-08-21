// Need to use the React-specific entry point to allow generating React hooks
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const basePathLocal = "http://localhost:3000/api"
// const basePathLive = "https://mybuzz.socian.ai:8081/api"

// Define a service using a base URL and expected endpoints
export const AdminDashboardAPISlice = createApi({
	reducerPath: 'AdminDashboardAPI',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_APP_API_URL }),

	refetchOnReconnect: true,

	tagTypes: ['Teams'],

	endpoints: (builder) => ({
		getTeams: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/teams?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			providesTags: (result) => {
				const defaultTag = { type: 'Teams', id: 'NEW' }

				return result
						? [
							...result.map(({ _id }) => ({ type: 'Teams', id: _id })),
							defaultTag,
						]
						: [defaultTag]
			}
		}),

		createTeam: builder.mutation({
			query(body) {
				return {
					url: `/teams`,
					method: 'POST',
					body,
				}
			},

			invalidatesTags: [{ type: 'Teams', id: 'NEW' }],
		})
	}),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetTeamsQuery, useCreateTeamMutation } = AdminDashboardAPISlice;
