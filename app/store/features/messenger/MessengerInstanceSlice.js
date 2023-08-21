import { createSlice } from '@reduxjs/toolkit'

const CONVERSATION_SEARCH_INTERFACE = {
	open: false,
	data: null
}

const CHAT_COMMAND_INTERFACE = {
	open: false,
	data: null
}

const CHAT_WINDOW_INTERFACE = {
	open: false,
	data: null
}

const initialState = {
	conversation_search: CONVERSATION_SEARCH_INTERFACE,
	chat_command: CHAT_COMMAND_INTERFACE,
	chat_window: CHAT_WINDOW_INTERFACE
}

export const messengerInstanceSlice = createSlice({
	name: 'messengerInstanceSlice',
	initialState,
	reducers: {
		activateConversationSearch: (state, action) => {
			state.conversation_search.open = true
			state.conversation_search.data = action.payload
		},
		inActivateConversationSearch: (state) => {
			state.conversation_search = CONVERSATION_SEARCH_INTERFACE
		},

		editConversationSearch: (state, action) => {
			state.conversation_search.open = true
			state.conversation_search.editing = true
			state.conversation_search.data = {
				...state.conversation_search.data,
				...action.payload
			}
		},

		activateChatCommand: (state, action) => {
			state.chat_command.open = true
			state.chat_command.data = action?.payload || null
		},
		inActivateChatCommand: (state) => {
			state.chat_command = CHAT_COMMAND_INTERFACE
		},
		editChatCommand: (state, action) => {
			state.chat_command.open = true
			state.chat_command.editing = true
			state.chat_command.data = {
				...state.chat_command.data,
				...action.payload
			}
		},

		activateChatWindow: (state, action) => {
			state.chat_window.open = true
			state.chat_window.data = action?.payload || null
			state.chat_window.data.userActivityType = action.payload?.userActivityType || 'chat'
		},
		inActivateChatWindow: (state) => {
			state.chat_window = CHAT_COMMAND_INTERFACE
		},
		editChatWindow: (state, action) => {
			state.chat_window.open = true
			state.chat_window.editing = true
			state.chat_window.data = action.payload
		},
	},
})

// Action creators are generated for each case reducer function
export const {
	activateConversationSearch,
	inActivateConversationSearch,
	editConversationSearch,

	activateChatCommand,
	inActivateChatCommand,
	editChatCommand,

	activateChatWindow,
	inActivateChatWindow,
	editChatWindow
} = messengerInstanceSlice.actions

export default messengerInstanceSlice.reducer