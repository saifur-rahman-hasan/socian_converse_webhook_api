// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {SocianConverseAPIBasePath} from "../../config";

// Define a service using a base URL and expected endpoints
export const PricingPlanAPISlice = createApi({
	reducerPath: 'PricingPlanAPI',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_APP_API_URL }),

	refetchOnReconnect: true,

	tagTypes: ['PricingPlans'],

	endpoints: (builder) => ({
		/**
		 * Get All or filtered pricing plans
		 */
		getPricingPlans: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(params).toString();
				return {
					url: `/pricing-plans?${queryString}`,
					method: 'GET',
				}
			},
			transformResponse(baseQueryReturnValue, meta, arg) {
				return baseQueryReturnValue.data
			},
			providesTags: (result) => {
				const defaultTag = { type: 'PricingPlans', id: 'NEW' }

				return result
					? [
						...result.map(({ _id }) => ({ type: 'PricingPlans', id: _id })),
						defaultTag,
					]
					: [defaultTag]
			}
		}),

		/**
		 * Create a new pricing plan
		 */
		createPricingPlan: builder.mutation({
			query(body) {
				return {
					url: `/pricing-plans`,
					method: 'POST',
					body,
				}
			},

			invalidatesTags: [{ type: 'PricingPlans', id: 'NEW' }],
		})
	}),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
	useGetPricingPlansQuery,
	useCreatePricingPlanMutation,
} = PricingPlanAPISlice;
