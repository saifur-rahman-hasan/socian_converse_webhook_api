export const getWorkspacesDefinition = {
	keepUnusedDataFor: 3,
	query: (params) => {
		const queryString = new URLSearchParams(params).toString();
		return {
			url: `/workspaces?${queryString}`,
			method: 'GET',
		}
	},
	transformResponse(baseQueryReturnValue, meta, arg) {
		return baseQueryReturnValue.data
	},
	providesTags: (result) => {
		const defaultTag = { type: 'Workspaces', id: 'NEW' }

		return result
			? [
				...result.map(({ _id }) => ({ type: 'Workspaces', id: _id })),
				defaultTag,
			]
			: [defaultTag]
	}
}

export const createWorkspaceDefinition = {
	query(body) {
		return {
			url: `/workspaces/`,
			method: 'POST',
			body,
		}
	},

	invalidatesTags: [{ type: 'Workspaces', id: 'NEW' }],
}

export const updateWorkspaceDefinition = {
	query({workspaceId, ...patch}) {
		return {
			url: `/workspaces/${workspaceId}`,
			method: 'PATCH',
			body: patch,
		}
	},

	transformResponse(baseQueryReturnValue, meta, arg) {
		return baseQueryReturnValue.data
	},

	async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
		const patchResult = dispatch(
			WorkspaceAPISlice.util.updateQueryData('getWorkspaces', id, (draft) => {
				Object.assign(draft, patch)
			})
		)
		try {
			await queryFulfilled
		} catch {
			patchResult.undo()
		}
	},
	invalidatesTags: (result, error, { id }) => [{ type: 'Workspaces', id }],
}

export const updateWorkspaceTelegramIntegrationWebhookDefinition = {
	keepUnusedDataFor: 3,
	query(query) {
		const {
			workspaceId,
			channelType,
			channelId,
			botToken,
		} = query

		const identifier = `${workspaceId}:${channelType}:${channelId}`

		let webhookUrl = `${process.env.NEXT_PUBLIC_APP_API_URL}/integrations/telegram/webhook?identifier=${identifier}`

		return {
			url: `https://api.telegram.org/bot${botToken}/setWebhook?url=${webhookUrl}`,
			method: 'GET'
		}
	}
}

export const getWorkspaceByIdDefinition = {
	keepUnusedDataFor: 3,
	query: (workspaceId) => {
		return {
			url: `/workspaces/${workspaceId}`,
			method: 'GET',
		}
	},
	transformResponse(baseQueryReturnValue, meta, arg) {
		return baseQueryReturnValue.data
	},
	providesTags: (result) => {
		const defaultTag = { type: 'Workspaces', id: 'NEW' }

		return result
			? [
				{ type: 'Workspaces', id: result._id },
				defaultTag,
			]
			: [defaultTag]
	}
}

export const getDraftWorkspaceDefinition = {
	keepUnusedDataFor: 3,
	query: (params) => {
		return {
			url: `/workspaces/draft`,
			method: 'GET',
		}
	},
	transformResponse(baseQueryReturnValue, meta, arg) {
		return baseQueryReturnValue.data
	}
}

export const getAgentWorkspacesDefinition = {
	keepUnusedDataFor: 3,
	query: (params) => {
		const queryString = new URLSearchParams(params).toString();
		return {
			url: `/agent/workspaces?${queryString}`,
			method: 'GET',
		}
	},
	transformResponse(baseQueryReturnValue, meta, arg) {
		return baseQueryReturnValue.data
	},
	providesTags: (result) => {
		const defaultTag = { type: 'AgentWorkspaces', id: 'NEW' }

		return result
			? [
				...result.map(({ _id }) => ({ type: 'AgentWorkspaces', id: _id })),
				defaultTag,
			]
			: [defaultTag]
	}
}