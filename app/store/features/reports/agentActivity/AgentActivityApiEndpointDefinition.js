import {socket} from "@/socket/socket";

export const getAgentActivitiesDefination = {
    query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return {
            url: `/agent-activity?${queryString}`,
            method: 'GET'
        }
    },
    transformResponse(baseQueryReturnValue, meta, arg) {
        return baseQueryReturnValue.data;
    },
    // providesTags: (result) => {
    //     const defaultTag = {type: 'AgentActivity', id: 'NEW'}
    //     return {
    //         data: result?.data
    //             ? [
    //                 ...result.data.map(({_id}) => ({type: 'AgentActivity', id: _id})),
    //                 defaultTag,
    //             ]
    //             : [defaultTag],
	// 		total: result?.total
    //     }
    // }
}

export const createAgentActivityDefinition = {
    query(body) {
        return {
            url: `/agent-activity`,
            method: 'POST',
            body,
        }
    },

    invalidatesTags: [{type: 'AgentActivity', id: 'NEW'}],
}


export const taskOverviewDefinition = {
    query(body) {
        return {
            url: `/workspaces/reports/taskOverview`,
            method: 'POST',
            body,
        }
    },

    invalidatesTags: [{type: 'TaskOverview', id: 'NEW'}],
}