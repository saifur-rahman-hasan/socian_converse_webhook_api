// Need to use the React-specific entry point to allow generating React hooks
import {
	createWorkspaceDefinition, getDraftWorkspaceDefinition, getWorkspaceByIdDefinition,
	getWorkspacesDefinition, updateWorkspaceDefinition,
	updateWorkspaceTelegramIntegrationWebhookDefinition,
	getAgentWorkspacesDefinition
} from "@/store/features/workspace/WorkspaceApiEndpointDefinition";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const WorkspaceAPISlice = createApi({
	reducerPath: 'WorkspaceAPI',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_APP_API_URL }),

	refetchOnReconnect: true,

	tagTypes: [
		'Workspaces',
		'WorkspaceTeams',
		'WorkspaceTeamMembers',
		'WorkspaceChannels',
		'AgentWorkspaces',
		'Templates',
		'Tag',
	],

	endpoints: (builder) => ({
		/**
		 * Get the list of workspaces
		 */
		getWorkspaces: builder.query(getWorkspacesDefinition),

		/**
		 * Create new Workspace
		 */
		createWorkspace: builder.mutation(createWorkspaceDefinition),

		/**
		 * Update Workspace
		 */
		updateWorkspace: builder.mutation(updateWorkspaceDefinition),

		updateWorkspaceTelegramIntegrationWebhook: builder.mutation(updateWorkspaceTelegramIntegrationWebhookDefinition),

		/**
		 * Get a single workspace
		 */
		getWorkspaceById: builder.query(getWorkspaceByIdDefinition),

		/**
		 * Get a single Draft workspace for a user
		 */
		getDraftWorkspace: builder.query(getDraftWorkspaceDefinition),

		/**
		 * Create a draft workspace for a user
		 */
		createDraftWorkspace: builder.mutation({
			query(body) {
				return {
					url: `/workspaces/draft`,
					method: 'POST',
					body,
				}
			}
		}),

		updateDraftWorkspace: builder.mutation({
			query(body) {
				return {
					url: `/workspaces/draft`,
					method: 'PUT',
					body,
				}
			},

			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			}
		}),

		destroyDraftWorkspace: builder.mutation({
			query(id) {
				return {
					url: `/workspaces/draft/${id}`,
					method: 'DELETE'
				}
			},

			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			}
		}),

		/**
		 * Get the list of workspace teams
		 */
		getWorkspaceTeams: builder.query({
			query: (workspaceId) => {
				return {
					url: `/workspaces/${workspaceId}/teams`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			providesTags: (result) => {
				const defaultTag = { type: 'WorkspaceTeams', id: 'NEW' }

				return result
					? [ ...result.map(({ id }) => ({ type: 'WorkspaceTeams', id: id })), defaultTag ]
					: [defaultTag]
			}
		}),

		/**
		 * Get the list of team members of a workspace
		 */
		getWorkspaceTeamMembers: builder.query({
			query: (params) => {
				const { workspaceId } = params
				const queryString = new URLSearchParams(params).toString();

				return {
					url: `/workspaces/${workspaceId}/teams/members?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			providesTags: (result) => {
				const defaultTag = { type: 'WorkspaceTeamMembers', id: 'NEW' }

				return result
					? [ ...result.map(({ id }) => ({ type: 'WorkspaceTeamMembers', id: id })), defaultTag ]
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
		
		/**
		 * Create workspace Team
		 */
		createRevokeTeamMember: builder.mutation({
			query(body) {
				const {workspaceId,teamId} = body

				return {
					url: `/workspaces/${workspaceId}/teams/${teamId}/member/`,
					method: 'POST',
					body,
				}
			},
			invalidatesTags: [{ type: 'WorkspaceTeamMembers', id: 'NEW' }],
		}),
		/**
		 * Switch Team
		 */
		createSwitchTeamMember: builder.mutation({
			query(body) {
				const {workspaceId,teamId} = body

				return {
					url: `/workspaces/${workspaceId}/teams/${teamId}/switch/`,
					method: 'POST',
					body,
				}
			},
			invalidatesTags: [{ type: 'WorkspaceTeamMembers', id: 'NEW' }],
		}),
		/**
		 * Create a draft workspace for a user
		 */
		createWorkspaceTeamMember: builder.mutation({
			query(body) {
				const {workspaceId} = body

				return {
					url: `/workspaces/${workspaceId}/teams/members`,
					method: 'POST',
					body,
				}
			},
			invalidatesTags: [{ type: 'WorkspaceTeamMembers', id: 'NEW' }],
		}),

		/**
		 * Get the list of workspace channels
		 */
		getWorkspaceChannels: builder.query({
			query: (queryArg) => {
				const { workspaceId } = queryArg
				const queryString = new URLSearchParams(queryArg).toString();

				return {
					url: `/workspaces/${workspaceId}/channels?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			providesTags: (result, error, arg) =>
				result
					? [...result.map(({ id }) => ({ type: 'WorkspaceChannels', id })), 'WorkspaceChannels']
					: ['WorkspaceChannels'],
		}),

		/**
		 * Get the list of workspace channels
		 */
		getWorkspaceChannel: builder.query({
			query: (QueryArg) => {
				const {workspaceId, channelId} = QueryArg
				const queryString = new URLSearchParams(QueryArg).toString();

				return {
					url: `/workspaces/${workspaceId}/channels/${channelId}?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			}
		}),

		/**
		 * Create new Workspace Channel
		 */
		createWorkspaceChannel: builder.mutation({
			query(body) {
				const {workspaceId} = body
				return {
					url: `/workspaces/${workspaceId}/channels`,
					method: 'POST',
					body,
				}
			},

			invalidatesTags: ['WorkspaceChannels'],
		}),

		/**
		 * Create new Workspace Channel
		 */
		updateWorkspaceChannel: builder.mutation({
			query(body) {
				const {workspaceId, channelId} = body
				return {
					url: `/workspaces/${workspaceId}/channels/${channelId}`,
					method: 'PATCH',
					body,
				}
			},

			invalidatesTags: ['Workspaces', 'WorkspaceChannels'],
		}),

		/**
		 * Create new Workspace Channel
		 */
		deleteWorkspaceChannel: builder.mutation({
			query(body) {
				const {workspaceId, channelId} = body
				return {
					url: `/workspaces/${workspaceId}/channels/${channelId}`,
					method: 'DELETE',
					body,
				}
			},

			invalidatesTags: ['Workspaces', 'WorkspaceChannels'],
		}),

		/**
		 * Get the list of workspaces
		 */
		getAgentWorkspaces: builder.query(getAgentWorkspacesDefinition),

		/**
		 * Get Message Temp
		 */
		getMessageTemplates: builder.query({
			query: (pageId) => {
				return {
					url: `/message_template`,
					method: 'GET',
					params: {
						pageId: pageId,
					},
				}
			},
            transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			providesTags: (result) => {
				const defaultTag = { type: 'Templates', id: 'NEW' }

				return result
					? [ ...result?.data?.map(({ id }) => ({ type: 'Templates', id: id })), defaultTag ]
					: [defaultTag]
			}
		}),
		
		searchTemplate: builder.mutation({
			query: (body) => {
				return {
					url: `/message_template`,
					method: 'POST',
					params: {
						actionType: "search_template",
					},
					body,
				}
			},
		}),
		
		getTags: builder.query({
			query: (pageId) => {
				return {
					url: `/tags/tag_manage`,
					method: 'GET',
					params: {
						pageId: pageId,
					},
				}
			},
            transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			providesTags: (result) => {
				const defaultTag = { type: 'Tag', id: 'NEW' }

				return result
					? [ ...result?.data?.map(({ id }) => ({ type: 'Tag', id: id })), defaultTag ]
					: [defaultTag]
			}
		}),
		searchTags: builder.mutation({
			query: (body) => {
				return {
					url: `/tags/tag_manage`,
					method: 'POST',
					params: {
						actionType: "search_tag",
					},
					body,
				}
			},
            invalidatesTags: ['Tag'],
		}),
		createTag: builder.mutation({
			query(body) {
				return {
					url: `/tags/tag_manage`,
					method: 'POST',
					body,
				}
			},

			invalidatesTags: ['Tag'],
		}),
		updateTag: builder.mutation({
			query(patch) {
				return {
					url: `/tags/tag_manage`,
					method: 'PATCH',
					body: patch,
				}
			},

			invalidatesTags: ['Tag'],
		}),
		createTemplate: builder.mutation({
			query(body) {
				const {workspaceId} = body
				return {
					url: `/message_template`,
					method: 'POST',
					body,
				}
			},

			invalidatesTags: ['Templates'],
		}),

		updateMessageTemplates: builder.mutation({
			query(patch) {
				return {
					url: `/message_template`,
					method: 'PATCH',
					body: patch,
				}
			},

			invalidatesTags: ['Templates'],
		}),

		getChannels: builder.query({
			query: () => {
				return {
					url: `/tags/tag_manage`,
					method: 'GET',
					params: {
						actionType: "get_channels",
					},
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			providesTags: (result, error, arg) =>
				result
					? [...result.map(({ id }) => ({ type: 'WorkspaceChannels', id })), 'WorkspaceChannels']
					: ['WorkspaceChannels'],
		}),
		
		createAddToChannel: builder.mutation({
			query: (body) => {
				return {
					url: `/tags/tag_manage`,
					method: 'POST',
					params: {
						actionType: "add_to_channel",
					},
					body
				}
			},
			invalidatesTags: ['Tag'],
		}),
		createRemoveFromChannel: builder.mutation({
			query: (body) => {
				return {
					url: `/tags/tag_manage`,
					method: 'POST',
					params: {
						actionType: "remove_from_channel",
					},
					body
				}
			},
			invalidatesTags: ['Tag'],
		}),
		createMessageTempAddToChannel: builder.mutation({
			query: (body) => {
				return {
					url: `/message_template/assignToChannel`,
					method: 'POST',
					params: {
						actionType: "create",
					},
					body
				}
			},
			invalidatesTags: ['Tag'],
		}),
		updateClosingTags: builder.mutation({

			query: (body) => {
				const {workspaceId} = body
				return {
					url: `/workspaces/${workspaceId}/channels/`,
					method: 'PATCH',
					body
				}
			},
			invalidatesTags: ['Tag'],
		}),


		getChannelThreads: builder.query({
			query: (queryArg) => {
				const { workspaceId } = queryArg
				const queryString = new URLSearchParams(queryArg).toString();

				return {
					url: `/workspaces/${workspaceId}/channels/getChannelThreads?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			providesTags: (result, error, arg) =>
				result
					? [...result.map(({ id }) => ({ type: 'WorkspaceChannels', id })), 'WorkspaceChannels']
					: ['WorkspaceChannels'],
		}),
		searchThread: builder.mutation({
			query: (body) => {
				const {workspaceId} = body
				return {
					url: `/workspaces/${workspaceId}/channels/getChannelThreads`,
					method: 'POST',
					body,
				}
			}
		}),

	}),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
	useGetWorkspacesQuery,
	useCreateWorkspaceMutation,
	useUpdateWorkspaceMutation,
	useGetWorkspaceByIdQuery,
	useGetDraftWorkspaceQuery,
	useCreateDraftWorkspaceMutation,
	useUpdateDraftWorkspaceMutation,
	useDestroyDraftWorkspaceMutation,
	useUpdateWorkspaceTelegramIntegrationWebhookMutation,
	useGetWorkspaceTeamsQuery,
	useGetWorkspaceTeamMembersQuery,
	useCreateWorkspaceTeamMutation,
	useCreateRevokeTeamMemberMutation,
	useCreateSwitchTeamMemberMutation,
	useCreateWorkspaceTeamMemberMutation,
	useGetWorkspaceChannelsQuery,
	useGetWorkspaceChannelQuery,
	useCreateWorkspaceChannelMutation,
	useUpdateWorkspaceChannelMutation,
	useDeleteWorkspaceChannelMutation,
	useGetAgentWorkspacesQuery,
	useGetMessageTemplatesQuery,
	useSearchTemplateMutation,
	useUpdateMessageTemplatesMutation,
	useGetTagsQuery,
	useSearchTagsMutation,
	useUpdateTagMutation,
	useCreateTagMutation,
	useCreateTemplateMutation,
	useGetChannelsQuery,
	useCreateAddToChannelMutation,
	useCreateMessageTempAddToChannelMutation,
	useCreateRemoveFromChannelMutation,
	useUpdateClosingTagsMutation,
	useGetChannelThreadsQuery,
	useSearchThreadMutation,
} = WorkspaceAPISlice;
