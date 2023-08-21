// Need to use the React-specific entry point to allow generating React hooks
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {socket} from "@/socket/socket";
import {activateAuthUser, inActivateAuthUser} from "@/store/features/user/AuthUserSlice";
import {debugLog} from "@/utils/helperFunctions";
import collect from "collect.js";
import {initializeUserDashboardList} from "@/store/features/dashboard/DashboardSlice";

// Define a service using a base URL and expected endpoints
export const UserAPISlice = createApi({
    reducerPath: 'UserAPI',
    baseQuery: fetchBaseQuery({baseUrl: process.env.NEXT_PUBLIC_APP_API_URL}),

    refetchOnReconnect: true,

    tagTypes: ['Users'],

    endpoints: (builder) => ({
        getUsers: builder.query({
            keepUnusedDataFor: 3,
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return {
                    url: `/users?${queryString}`,
                    method: 'GET',
                }
            },
            async onCacheEntryAdded(QueryArg, {updateCachedData, cacheDataLoaded, cacheEntryRemoved}) {
                console.log('socket created for getUsers entrypoint')

                try {
                    await cacheDataLoaded

                    socket
                        .connect()
                        .on('newUserAdded', (data) => {
                            updateCachedData((draft) => {
                                const user = draft.find(c => c?._id === data?._id)

                                if (user?._id) {
                                    user.updated_at = data?.updated_at
                                } else {
                                    draft.push(data)
                                }
                            })
                        })

                } catch (err) {

                }
            },
            transformResponse(baseQueryReturnValue, meta, arg) {
                return baseQueryReturnValue.data
            },
            providesTags: (result) => {
                const defaultTag = {type: 'Users', id: 'NEW'}
                try {
                    return result
                        ? [
                            ...result.map(({_id}) => ({type: 'Users', id: _id})),
                            defaultTag,
                        ]
                        : [defaultTag]
                } catch (err) {
                    return [defaultTag]
                }
            }
        }),

        getAgents: builder.query({
            keepUnusedDataFor: 3,
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return {
                    url: `/agent/getWorkspaceAgents?${queryString}`,
                    method: 'GET',
                }
            },
            transformResponse(baseQueryReturnValue, meta, arg) {
                return baseQueryReturnValue.data
            },
        }),

        createUser: builder.mutation({
            query(body) {
                return {
                    url: `/users`,
                    method: 'POST',
                    body,
                }
            },

            invalidatesTags: [{type: 'Users', id: 'NEW'}],
        }),


        getAuthUserRolesAndPermissions: builder.query({
            keepUnusedDataFor: 3600, // for 1 hr
            query: (params) => {
                const { userId } = params;
                return {
                    url: `/users/${userId}/getRolesAndPermissions`,
                    method: 'GET',
                }
            },
            transformResponse(baseQueryReturnValue, meta, arg) {
                return baseQueryReturnValue.data
            },
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                try {
                    const { data: aclAccessData } = await queryFulfilled;
                    const { user, roles, permissions } = aclAccessData;
                    const authUserAclAccess = roles?.length || permissions?.length ? {
                        roles,
                        permissions
                    } : null;

                    const isAdmin = !!roles?.find(role => role.name.toLowerCase() === 'admin');
                    const isAgent = !!roles?.find(role => role.name.toLowerCase() === 'agent');
                    const isSupervisor = !!roles?.find(role => role.name.toLowerCase() === 'supervisor');
                    const isQCManager = !!roles?.find(role => role.name.toLowerCase() === 'qcmanager');

                    let userDashboardListData = []

                    if(isAdmin){
                        userDashboardListData.push({id: 'adminDashboard', name: 'Admin Dashboard', current: false})
                    }

                    if(isQCManager) {
                        userDashboardListData.push({id: 'qcManagerDashboard', name: 'QC Manager Dashboard', current: false})
                    }

                    if(isSupervisor){
                        userDashboardListData.push({id: 'supervisorDashboard', name: 'QC Manager Dashboard', current: false})
                    }

                    if(isAgent) {
                        userDashboardListData.push({id: 'agentDashboard', name: 'Agent Dashboard', current: false})
                    }

                    // `onSuccess` side-effect
                    dispatch(activateAuthUser({
                        authUser: user || null,
                        authUserAclAccess,
                        isAdmin,
                        isAgent,
                        isSupervisor,
                        isQCManager
                    }))


                    dispatch(
                        initializeUserDashboardList({userDashboard: userDashboardListData })
                    )

                } catch (err) {
                    // `onError` side-effect
                    dispatch(inActivateAuthUser())
                }
            },
        }),
    }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
    useGetUsersQuery,
    useGetAgentsQuery,
    useCreateUserMutation,
    useGetAuthUserRolesAndPermissionsQuery
} = UserAPISlice;
