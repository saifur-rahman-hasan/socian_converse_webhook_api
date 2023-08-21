import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const TagsAndTemplatesApiSlice = createApi({
	reducerPath: 'TagsAndTemplatesApi',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_APP_API_URL }),

	refetchOnReconnect: true,

	tagTypes: [
		'MnaTags',
		'MnaTemplates',
	],

	endpoints: (builder) => ({
		
		getMessageTemplates: builder.query({
			query: () => {
				return {
					url: `/message_template`,
					method: 'GET',
				}
			},
            transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			providesTags: (result) => {
				const defaultTag = { type: 'MnaTemplates', id: 'NEW' }

				return result
					? [ ...result.map(({ id }) => ({ type: 'MnaTemplates', id: id })), defaultTag ]
					: [defaultTag]
			}
		}),

		/**
		 * Create workspace Team
		 */
		createWorkspaceTeam: builder.mutation({
			query(body) {
				const {workspaceId,teamId} = body

				return {
					url: `/workspaces/${workspaceId}/teams/`,
					method: 'POST',
					body,
				}
			},
			invalidatesTags: [{ type: 'WorkspaceTeamMembers', id: 'NEW' }],
		}),
	}),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
	useGetMessageTemplatesQuery
} = TagsAndTemplatesApiSlice;
