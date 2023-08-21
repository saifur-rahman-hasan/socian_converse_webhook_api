// Need to use the React-specific entry point to allow generating React hooks
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {socket} from "@/socket/socket";
import {debugLog} from "@/utils/helperFunctions";

// Define a service using a base URL and expected endpoints
export const AgentDashboardAPISlice = createApi({
	reducerPath: 'AgentDashboardApiSlice',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_APP_API_URL }),

	refetchOnReconnect: true,

	tagTypes: ['AgentAssignedTasks'],

	endpoints: (builder) => ({
		getAssignedTasks: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/agent/tasks/getAssignedTasks?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			async onCacheEntryAdded(QueryArg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
				console.log('__converseMessenger__{workspaceId}_{agentId}__agent:task:assigned')
				const { workspaceId, agentId } = QueryArg

				// __converseMessenger__{workspaceId}_{agentId}__agent:task:assigned
				const clientEventPrivateKey = `__converseMessenger__${workspaceId}_${agentId}__agent:task:assigned`
				console.log(`clientEventPrivateKey:`, clientEventPrivateKey)
				try {
					await cacheDataLoaded
					socket
						.connect()
						.on(`${clientEventPrivateKey}`, (data) => {
							updateCachedData((draft) => {
								console.log('received data:', data)
								const task = draft.find(t => t?._id === data?._id)
								if(task?._id){
									task.updatedAt = data?.updatedAt
								}else{
									draft.push(data)
								}
							})
						})

				}catch (err){

				}
			},
			providesTags: (result) => {
				const defaultTag = {type: 'AgentAssignedTasks', id: 'NEW'}
				try {
					return result
						? [...result.map(({_id}) => ({type: 'AgentAssignedTasks', id: _id})), defaultTag]
						: [defaultTag];
				} catch (err) {
					return [defaultTag]
				}
			}
		}),

		getAgentAssignedTeams: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/agent/getAgentAssignedTeams?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			}
		}),

		/**
		 * Get a single workspace
		 */
		getAssignedTask: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/agent/tasks/getTheQueueTaskInfo?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			async onCacheEntryAdded(QueryArg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
				console.log('agent task assigned')
				const { agentId, taskId } = QueryArg

				// __converseMessenger__2_agent_1:task:assigned
				const clientEventPrivateKey = `__converseMessenger__${workspaceId}__conversation:updated`

				try {
					await cacheDataLoaded

					socket
						.connect()
						.on(`${clientEventPrivateKey}`, (data) => {
							updateCachedData((draft) => {
								const conversation = draft.find(c => c?._id === data?._id)

								if(conversation?._id){
									conversation.updated_at = data?.updated_at
									conversation.lastMessage = data?.lastMessage
								}else{
									draft.push(data)
								}
							})
						})

				}catch (err){

				}
			},
		}),

		getAgentActiveTasks: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/agent/activeTask/getAgentActiveTasks?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
		}),

		getAgentQueueTasks: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/agent/activeTask/getAgentQueueTasks?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
		}),

		getAgentActiveTask: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/agent/activeTask/getActiveTask?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
		}),

		startAgentActiveTask: builder.mutation({
			query(body) {
				return {
					url: `/agent/activeTask/startActiveTask`,
					method: 'POST',
					body,
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
		}),

		pauseAgentActiveTask: builder.mutation({
			query(body) {
				return {
					url: `/agent/activeTask/pauseActiveTask`,
					method: 'POST',
					body,
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
		}),

		stopAgentActiveTask: builder.mutation({
			query(body) {
				return {
					url: `/agent/activeTask/stopActiveTask`,
					method: 'POST',
					body,
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
		}),


		// Agent Accept the Queue Task
		agentTaskAcceptAction: builder.mutation({
			query(body) {
				return {
					url: `/agent/actions/agentTaskAccept`,
					method: 'POST',
					body,
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			invalidatesTags: ['AgentAssignedTasks']
		}),

		// Agent Bookmarked the Assigned Task
		agentTaskBookmarkAction: builder.mutation({
			query(body) {
				return {
					url: `/agent/actions/agentTaskBookmark`,
					method: 'POST',
					body,
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			invalidatesTags: ['AgentAssignedTasks']
		}),

	}),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
	useGetAssignedTasksQuery,
	useGetAssignedTaskQuery,
	useGetAgentActiveTaskQuery,
	useStartAgentActiveTaskMutation,
	usePauseAgentActiveTaskMutation,
	useStopAgentActiveTaskMutation,
	useGetAgentAssignedTeamsQuery,
	useGetAgentActiveTasksQuery,
	useGetAgentQueueTasksQuery,
	useAgentTaskAcceptActionMutation,
	useAgentTaskBookmarkActionMutation,
} = AgentDashboardAPISlice;
