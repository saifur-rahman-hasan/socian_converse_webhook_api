// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {socket} from "@/socket/socket";

// Define a service using a base URL and expected endpoints
export const CalendarAPISlice = createApi({
	reducerPath: 'CalendarAPISlice',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_APP_API_URL }),

	refetchOnReconnect: true,

	tagTypes: ['AgentCalendarEvents'],

	endpoints: (builder) => ({
		getAgentCalenderEvent: builder.query({
			query: (params) => {
				const { workspaceId } = params
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/workspaces/${workspaceId}/calendar/getAgentCalendarEvents?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
		}),
	}),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
	useGetAgentCalenderEventQuery,
} = CalendarAPISlice;
