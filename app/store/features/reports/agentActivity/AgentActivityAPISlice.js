import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import {
    createAgentActivityDefinition,
    getAgentActivitiesDefination, taskOverviewDefinition
} from "@/store/features/reports/agentActivity/AgentActivityApiEndpointDefinition";

// Define a service using a base URL and expected endpoints
export const AgentActivityAPISlice = createApi({
    reducerPath: 'AgentActivityAPI',
    baseQuery: fetchBaseQuery({baseUrl: process.env.NEXT_PUBLIC_APP_API_URL}),

    refetchOnReconnect: true,

    tagTypes: [
        'AgentActivity','TaskOverview', 'Tag'
    ],

    endpoints: (builder) => ({
        /**
         * Get All or filtered pricing plans
         */
        getAgentActivities: builder.query(getAgentActivitiesDefination),
        
        
        /**
         * Create a new pricing plan
        */
       createAgentActivity: builder.mutation(createAgentActivityDefinition),
       getTaskOverview: builder.mutation(taskOverviewDefinition),
       
       
       getTagList: builder.query({
            query: () => {
                return {
                    url: `/tags/tag_manage`,
                    method: 'GET',
                }
            },
            transformResponse(baseQueryReturnValue, meta, arg) {
                return baseQueryReturnValue.data
            },
            providesTags: (result) => {
                const defaultTag = { type: 'Tag', id: 'NEW' }

                return result
                    ? [ ...result.map(({ id }) => ({ type: 'Tag', id: id })), defaultTag ]
                    : [defaultTag]
            }
       }),
    }),
})

export const {
    useGetAgentActivitiesQuery,
    useCreateAgentActivityMutation,
    useGetTaskOverviewMutation,
    useGetTagListQuery,
} = AgentActivityAPISlice;
