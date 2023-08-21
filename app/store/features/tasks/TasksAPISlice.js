// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {SocianConverseAPIBasePath} from "../../config";
import {activateAuthUser, inActivateAuthUser} from "@/store/features/user/AuthUserSlice";
import {debugLog} from "@/utils/helperFunctions";
import {updateQCManagerTaskFilterData} from "@/store/features/draft/draftSlice";

// Define a service using a base URL and expected endpoints
export const TasksAPISlice = createApi({
	reducerPath: 'TasksAPI',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_APP_API_URL }),

	refetchOnReconnect: true,

	tagTypes: ['Tasks','ThreadTasks', "QCManagerFilteredTasks"],

	endpoints: (builder) => ({
		getTasks: builder.query({
			keepUnusedDataFor: 3,

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
			providesTags: (result) => {
				const defaultTag = { type: 'Tasks', id: 'NEW' }
				return result
					? [
						...result.map(({ _id }) => ({ type: 'Tasks', id: _id })),
						defaultTag,
					]
					: [defaultTag]
			}
		}),

		/**
		 * Get a single workspace
		 */
		getTaskByThreadId: builder.query({
			keepUnusedDataFor: 3,

			query: (params) => {
				const queryString = new URLSearchParams(params).toString();

				return {
					url: `/agent/tasks/getTasksByThread/?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			providesTags: (result) => {
				const defaultTag = { type: 'ThreadTasks', id: 'NEW' }

				return result
					? [
						{ type: 'ThreadTasks', id: result._id },
						defaultTag,
					]
					: [defaultTag]
			}
		}),

		createTask: builder.mutation({
			query(body) {
				return {
					url: `/agent/tasks/createAssignableTask`,
					method: 'POST',
					body,
				}
			},
			invalidatesTags: [{ type: 'Tasks', id: 'NEW' }],
		}),

		assignTask: builder.mutation({
			query(body) {
				return {
					url: `/agent/tasks/assignTask`,
					method: 'POST',
					body,
				}
			},
			invalidatesTags: [{ type: 'Tasks', id: 'NEW' }],
		}),

		forwardTask: builder.mutation({
			query(body) {
				return {
					url: `/agent/tasks/forwardTask`,
					method: 'POST',
					body,
				}
			},
			invalidatesTags: [{ type: 'Tasks', id: 'NEW' }],
		}),

		getQCManagerFilteredTasks: builder.mutation({
			keepUnusedDataFor: 10,
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
			query: (body) => {
				return {
					url: `/QCManager/getQCManagerFilteredTasks`,
					method: 'POST',
					body: body
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				try {

					const { data: queryData } = await queryFulfilled;
					debugLog('queryData: ', queryData)

					dispatch(updateQCManagerTaskFilterData(queryData?.filter || null))

				} catch (err) {

				}
			},
		}),
	}),
})

export const {
	useGetTasksQuery,
	useGetTaskByThreadIdQuery,
	useCreateTaskMutation,
	useAssignTaskMutation,
	useForwardTaskMutation,
	useGetQCManagerFilteredTasksMutation
} = TasksAPISlice;
