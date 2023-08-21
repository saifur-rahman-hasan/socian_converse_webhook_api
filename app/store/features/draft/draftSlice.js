import { createSlice } from '@reduxjs/toolkit'

const newDate = (new Date).toISOString()

const initialState = {
	messengerChatTaskCreateModal: {
		open: false,
		data: null
	},

	QCManagerTaskFilter: {
		channels: [],
		threads: [],
		"dateRange": {
			"from": newDate,
			"to": newDate
		},
		"threadId": [],
		"iceFeedback": [],
		"agents": [],
		"taskStatus": [],
		"tags": [],
		"from": 0,
		"size": 50,
		"total": 0
	}
}

export const draftSlice = createSlice({
	name: 'draftSlice',
	initialState,
	reducers: {
		openChatTaskCreateModal: (state, action) => {
			state.messengerChatTaskCreateModal.open = true
			state.messengerChatTaskCreateModal.data = action.payload
		},
		closeChatTaskCreateModal: (state) => {
			state.messengerChatTaskCreateModal.open = false
			state.messengerChatTaskCreateModal.data = null
		},
		updateChatTaskCreateData: (state, action) => {
			state.messengerChatTaskCreateModal.data = action.payload
		},
		updateQCManagerTaskFilterData: (state, action) => {
			const payload = action?.payload || null
			state.QCManagerTaskFilter = {
				"channels": payload?.channels || [],
				"dateRange": {
					"from": payload?.dateRange?.from || (new Date).toISOString(),
					"to": payload?.dateRange?.to || (new Date).toISOString()
				},
				"threadId": payload?.threadId || [],
				"threads": payload?.threads || [],
				"iceFeedback": payload?.iceFeedback || [],
				"agents": payload?.agents || [],
				"taskStatus": payload?.taskStatus || [],
				"tags": payload?.tags || [],
				"from": payload?.from || 0,
				"size": payload?.size || 50,
				"total": payload?.total
			}
		},
		updateQCManagerTaskFilterFromAndSize: (state, action) => {
			const payload = action?.payload || null
			state.QCManagerTaskFilter.from = payload?.from || 0
			state.QCManagerTaskFilter.size = payload?.size || 0
		}
	},
})

// Action creators are generated for each case reducer function
export const {
	openChatTaskCreateModal,
	closeChatTaskCreateModal,
	updateChatTaskCreateData,
	updateQCManagerTaskFilterData,
	updateQCManagerTaskFilterFromAndSize
} = draftSlice.actions

export default draftSlice.reducer