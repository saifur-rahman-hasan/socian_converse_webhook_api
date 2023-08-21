import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	active: false
}

export const CalendarAppSlice = createSlice({
	name: 'user_slice',
	initialState,
	reducers: {
		activateCalendar: (state, action) => {
			state.active = true
		}
	},
})

// Action creators are generated for each case reducer function
export const {
	activateCalendar,
} = CalendarAppSlice.actions

export default CalendarAppSlice.reducer