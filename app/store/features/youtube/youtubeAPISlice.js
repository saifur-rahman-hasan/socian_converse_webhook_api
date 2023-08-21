import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const youtubeAPISlice = createApi({
	reducerPath: 'youtubeAPI',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_APP_API_URL }),

	refetchOnReconnect: true,

	tagTypes: [
		'youtube',
	],

	endpoints: (builder) => ({
        
		/**
		 * Get the list of workspace teams
		 */
		getYoutube: builder.query({
			query: (workspaceId) => {
				return {
					url: `/youtube`,
					method: 'GET',
				}
			},
			// transformResponse(baseQueryReturnValue, meta, arg) {
			// 	return baseQueryReturnValue.data
			// },
			// providesTags: (result) => {
			// 	const defaultTag = { type: 'youtubeAPI', id: 'NEW' }

			// 	return result
			// 		? [ ...result.map(({ id }) => ({ type: 'youtubeAPI', id: id })), defaultTag ]
			// 		: [defaultTag]
			// }
		}),

	}),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
	useGetYoutubeQuery,
} = youtubeAPISlice;
