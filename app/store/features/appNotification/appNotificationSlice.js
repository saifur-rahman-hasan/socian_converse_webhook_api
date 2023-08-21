import { createSlice } from '@reduxjs/toolkit'

const ALERT_OBJECT_INTERFACE = {
	open: false,
	data: null,
}

const initialState = {
	error: ALERT_OBJECT_INTERFACE,
	success: ALERT_OBJECT_INTERFACE,
	warning: ALERT_OBJECT_INTERFACE,
	info: ALERT_OBJECT_INTERFACE
}

export const appNotificationSlice = createSlice({
	name: 'appNotification',
	initialState,
	reducers: {
		setError: (state, action) => {
			state.error.open = true
			state.error.data = action.payload
		},
		clearError: (state) => {
			state.error = ALERT_OBJECT_INTERFACE
		}
	},
})

// Action creators are generated for each case reducer function
export const {
	setError,
	clearError
} = appNotificationSlice.actions

export default appNotificationSlice.reducer