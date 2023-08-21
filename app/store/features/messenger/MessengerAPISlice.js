import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
	getConversationsDefinition,
	getConversationByIdDefinition,
	getConversationThreadDefinition,
	getConversationThreadsDefinition,
	getConversationMessagesDefinition,
	createConversationMessageDefinition,
} from "@/store/features/messenger/MessengerApiEndpointDefinition";
import collect from "collect.js";

// Define a service using a base URL and expected endpoints
export const MessengerAPISlice = createApi({
	reducerPath: 'MessengerAPI',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_APP_API_URL }),

	refetchOnReconnect: true,

	tagTypes: [
		'Conversations',
		'ConversationMessages',
		'ConversationTasks',
	],

	endpoints: (builder) => ({
		/**
		 * Get All or filtered pricing plans
		 */
		getConversations: builder.query(getConversationsDefinition),

		/**
		 * Get a single workspace
		 */
		getConversationById: builder.query(getConversationByIdDefinition),

		/**
		 * Get All or filtered conversation messages
		 */
		getMessagesByConversationId: builder.query(getConversationMessagesDefinition),

		/**
		 * Create a new message for a conversation
		 */
		createConversationMessage: builder.mutation(createConversationMessageDefinition),

		/**
		 * Get All or filtered conversation tasks
		 */
		getThreadsByConversationId: builder.query(getConversationThreadsDefinition),

		getThreadById: builder.query(getConversationThreadDefinition),

		/**
		 * Close a Conversation Thread
		 */
		closeConversationThread: builder.mutation({
			query(body) {
				const {conversationId} = body
				return {
					url: `/agent/actions/closeAgentAssignedTask`,
					method: 'POST',
					body,
				}
			},

			invalidatesTags: [{ type: 'ConversationTasks', id: 'NEW' }],
		}),

		/**
		 * Collect Message Sentiment Data
		 */
		fetchMessageTopicData: builder.mutation({
			query(messageText) {
				return {
					url: `https://socian.ai:5000/v1/all-topic`,
					method: 'POST',
					body: {
						text: messageText
					},
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return collect(baseQueryReturnValue.data.data).firstWhere('key', 'mfs');
			},
		}),

		/**
		 * Collect Message Topic Data
		 */
		fetchMessageSentimentData: builder.mutation({
			query(messageText) {
				return {
					url: `https://socian.ai:5000/v1/all-sentiment`,
					method: 'POST',
					body: {
						text: messageText
					},
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return collect(baseQueryReturnValue.data.data).firstWhere('key', 'general');
			},
		}),

		/**
		 * Collect Message Topic Data
		 */
		getMessengerThreadInfo: builder.query({
			keepUnusedDataFor: 3,
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/messenger/getMessengerThreadInfo?${queryString}`,
					method: 'GET'
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data;
			},
		}),

		/**
		 * Collect Message Topic Data
		 */
		getAssignedTaskByThreadId: builder.query({
			keepUnusedDataFor: 3,
			query: (params) => {
				const {conversationId} = params
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/messenger/conversations/${conversationId}/getConversationTaskInfo?${queryString}`,
					method: 'GET'
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data;
			},
		}),
		
		/**
		 * Search Users.
		 */
		createConversationConsumers: builder.mutation({
			keepUnusedDataFor: 3,
			query: (query) => {
				// const {conversationId} = params
				// const queryString = new URLSearchParams(params).toString();
				return {
					url: `/messenger/conversations/search_consumers`,
					method: 'POST',
					body: query,
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data;
			},
		}),

	}),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
	useGetConversationsQuery,
	useGetConversationByIdQuery,
	useGetMessagesByConversationIdQuery,
	useGetThreadsByConversationIdQuery,
	useCreateConversationMessageMutation,
	useCreateConversationTaskMutation,
	useCloseConversationThreadMutation,
	useFetchMessageSentimentDataMutation,
	useFetchMessageTopicDataMutation,
	useGetMessengerThreadInfoQuery,
	useGetAssignedTaskByThreadIdQuery,
	useCreateConversationConsumersMutation
} = MessengerAPISlice;
