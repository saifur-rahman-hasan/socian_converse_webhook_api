import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	selected_date_time:{
		currentDate: "",
		previousDate: "",
	}

}

export const reportsSlice = createSlice({
	name: 'reports',
	initialState,
	reducers: {
		saveCurrentDate:(state,action) => {
			state.selected_date_time.currentDate = action.payload
		},
		savePreviousDate:(state,action) => {
			state.selected_date_time.previousDate = action.payload
		}
	},
})

// Action creators are generated for each case reducer function
export const { saveCurrentDate,savePreviousDate} = reportsSlice.actions

export default reportsSlice.reducer