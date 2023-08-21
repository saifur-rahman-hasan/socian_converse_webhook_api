import {socket} from "@/socket/socket";

export const getConversationsDefinition = {
	keepUnusedDataFor: 3,

	query: (params) => {
		const queryString = new URLSearchParams(params).toString();
		return {
			url: `/messenger/conversations?${queryString}`,
			method: 'GET'
		}
	},

	async onCacheEntryAdded(QueryArg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
		console.log('socket created for getConversations entrypoint')
		const { workspaceId, channelId } = QueryArg

		// __converseMessenger__2_messenger_1__conversation:added
		const clientEventPrivateKey = `__converseMessenger__${workspaceId}_${channelId}__conversation:updated`

		try {
			await cacheDataLoaded

			socket
				.connect()
				.on(`${clientEventPrivateKey}`, (data) => {
					updateCachedData((draft) => {
						const conversation = draft.find(c => c?._id === data?._id)
						console.log(`redux data: `, data)
						console.log(`redux draft data: `, JSON.stringify(conversation))
						if(conversation?._id){
							conversation.updatedAt = data?.updatedAt
							conversation.lastMessage = data?.lastMessage
						}else{
							draft.push(data)
						}
					})
				})

		}catch (err){

		}
	},
	transformResponse(baseQueryReturnValue, meta, arg) {
		return baseQueryReturnValue.data;
	},
	providesTags: (result) => {
		const defaultTag = { type: 'Conversations', id: 'NEW' }

		return result?.data
			? [
				...result?.data?.map(({ _id }) => ({ type: 'Conversations', id: _id })),
				defaultTag,
			]
			: [defaultTag]
	}
}

export const getConversationByIdDefinition = {
	keepUnusedDataFor: 3,

	query: (QueryArg) => {
		const { conversationId } = QueryArg
		const queryString = new URLSearchParams(QueryArg).toString();

		return {
			url: `/messenger/conversations/${conversationId}?${queryString}`,
			method: 'GET',
		}
	},
	transformResponse(baseQueryReturnValue, meta, arg) {
		return baseQueryReturnValue.data
	},
	providesTags: (result) => {
		const defaultTag = { type: 'Conversations', id: 'NEW' }

		return result
			? [
				{ type: 'Conversations', id: result._id },
				defaultTag,
			]
			: [defaultTag]
	}
}

export const getConversationMessagesDefinition = {
	keepUnusedDataFor: 3,
	query: (QueryArg) => {
		const { conversationId } = QueryArg
		const queryString = new URLSearchParams(QueryArg).toString();

		return {
			url: `/messenger/conversations/${conversationId}/messages?${queryString}`,
			method: 'GET'
		}
	},
	async onCacheEntryAdded(QueryArg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
		console.log('socket created for getConversationMessages entrypoint')

		const { workspaceId, channelId, conversationId } = QueryArg

		// __converseMessenger__2_messenger_1__conversation:added
		const clientEventPrivateKey = `__converseMessenger__${workspaceId}_${channelId}__${conversationId}__message:updated`

		try {
			await cacheDataLoaded

			socket
				.connect()
				.on(`${clientEventPrivateKey}`, (data) => {
					updateCachedData((draft) => {
						const message = draft.find(m => m?._id === data?._id)
						if(!message?._id){
							draft.push(data)
						}
					})
				})

		}catch (err){

		}
	},
	transformResponse(baseQueryReturnValue, meta, arg) {
		return baseQueryReturnValue.data;
	},
	providesTags: (result) => {
		const defaultTag = { type: 'ConversationMessages', id: 'NEW' }
		return result
			? [ ...result.map(({ _id }) => ({ type: 'ConversationMessages', id: _id })), defaultTag ]
			: [defaultTag]
	}
}

export const createConversationMessageDefinition = {
	query(body) {
		const {conversationId} = body
		return {
			url: `/messenger/conversations/${conversationId}/messages/sendMessage`,
			method: 'POST',
			body,
		}
	}
}

export const getConversationThreadsDefinition = {
	keepUnusedDataFor: 3,

	query: (QueryArg) => {
		const {conversationId} = QueryArg
		const queryString = new URLSearchParams(QueryArg).toString();

		return {
			url: `/messenger/conversations/${conversationId}/threads?${queryString}`,
			method: 'GET',
		}
	},
	transformResponse(baseQueryReturnValue, meta, arg) {
		return baseQueryReturnValue.data;
	},
	providesTags: (result) => {
		const defaultTag = { type: 'ConversationTasks', id: 'NEW' }

		return result
			? [ ...result.map(({ _id }) => ({ type: 'ConversationTasks', id: _id })), defaultTag ]
			: [defaultTag]
	}
}

export const getConversationThreadDefinition = {
	keepUnusedDataFor: 3,

	query: (QueryArg) => {
		const {conversationId, threadId} = QueryArg
		const queryString = new URLSearchParams(QueryArg).toString();

		return {
			url: `/messenger/conversations/${conversationId}/threads/${threadId}?${queryString}`,
			method: 'GET',
		}
	},
	transformResponse(baseQueryReturnValue, meta, arg) {
		return baseQueryReturnValue.data;
	},
	providesTags: (result) => {
		const defaultTag = { type: 'ConversationTasks', id: 'NEW' }

		return result
			? [ { type: 'ConversationTasks', id: result._id }, defaultTag ]
			: [defaultTag]
	}
}