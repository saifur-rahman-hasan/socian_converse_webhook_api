// Need to use the React-specific entry point to allow generating React hooks
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

// const basePathLocal = "http://localhost:3000/api"
const basePathLive = "https://mybuzz.socian.ai:8081/api"

// Define a service using a base URL and expected endpoints
export const ConsumerBuzzSubscriptionAPI = createApi({
	reducerPath: 'ConsumerBuzzSubscriptionAPI',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_APP_API_URL }),
	endpoints: (builder) => ({
		getSubscriptionPackages: builder.query({
			query: () => {
				return {
					url: `/subscription/packages-v2/`,
					method: 'GET',
				}
			}
		}),

		createCheckoutSessionForFrontend: builder.mutation({
			query(body) {
				return {
					url: `/subscription/create-checkout-session-frontend/`,
					method: 'POST',
					body,
				}
			}
		})
	}),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetSubscriptionPackagesQuery, useCreateCheckoutSessionForFrontendMutation } = ConsumerBuzzSubscriptionAPI