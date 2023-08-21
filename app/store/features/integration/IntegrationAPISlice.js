// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {SocianConverseAPIBasePath} from "../../config";

// Define a service using a base URL and expected endpoints
export const IntegrationAPISlice = createApi({
	reducerPath: 'IntegrationAPI',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_APP_API_URL }),

	refetchOnReconnect: true,

	endpoints: (builder) => ({
		fbExchangeToken: builder.mutation({
			query(body) {
				return {
					url: `/integrations/messenger/actions/getLongLivedAccessToken`,
					method: 'POST',
					body,
				}
			}
		}),

		/**
		 * Get the list of permitted messenger accounts on Facebook
		 */
		getMessengerConnectedAccounts: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/integrations/messenger/accounts?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data.data
			},
		}),

		/**
		 * Get the list of permitted facebook page accounts on Facebook
		 */
		getFacebookPageConnectedAccounts: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/integrations/facebookPage/actions/accounts?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data.data
			},
		}),

		/**
		 * Get the list of permitted messenger accounts on Facebook
		 */
		getMessengerConnectedAccountInfo: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/integrations/messenger/accountPageInfo?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
		}),

		getInstagramMessengerConnectedAccountInfo: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/integrations/instagramMessenger/actions/getAccountInfo?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
		}),

		importMessengerConversations: builder.mutation({
			query(body) {
				return {
					url: `/integrations/messenger/actions/syncChannelData`,
					method: 'POST',
					body,
				}
			}
		})
	}),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
	useGetMessengerConnectedAccountsQuery,
	useGetFacebookPageConnectedAccountsQuery,
	useGetMessengerConnectedAccountInfoQuery,
	useImportMessengerConversationsMutation,
	useFbExchangeTokenMutation,
	useGetInstagramMessengerConnectedAccountInfoQuery
} = IntegrationAPISlice;
