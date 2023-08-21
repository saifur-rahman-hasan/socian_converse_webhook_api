import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dataSynchronizerAPISlice = createApi({
	reducerPath: 'dataSynchronizer',
	baseQuery: fetchBaseQuery({ baseUrl: "https://chikitsa.xyz:3006" }),

	refetchOnReconnect: true,

	tagTypes: [
		'dataSynchronizer',
	],

	endpoints: (builder) => ({
		getYoutubeAuthLink: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();

				return {
					url: `/youtube-data-api/auth-url?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue
			},
			// providesTags: (result) => {
			// 	const defaultTag = {type: 'youtubeAPI', id: 'NEW'}
			// }
			// 	return result
			// 		? [ ...result.map(({ id }) => ({ type: 'youtubeAPI', id: id })), defaultTag ]
			// 		: [defaultTag]
			// }
		}),
		getYoutubeChannelInfo: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();

				return {
					url: `/youtube-data-api/getMyChannelDetails?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue
			},
			// providesTags: (result) => {
			// 	const defaultTag = {type: 'youtubeAPI', id: 'NEW'}
			// }
			// 	return result
			// 		? [ ...result.map(({ id }) => ({ type: 'youtubeAPI', id: id })), defaultTag ]
			// 		: [defaultTag]
			// }
		}),
	}),
})

export const {
	useGetYoutubeAuthLinkQuery,useGetYoutubeChannelInfoQuery
} = dataSynchronizerAPISlice;
