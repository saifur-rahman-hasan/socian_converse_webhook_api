import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	selected_nav_item: "dashboard",
	popup:{
		show: false,
		title: "Title goes here",
		message: "Message Goes Here",
		state: "error" //success,warning
	}

}

export const globalSlice = createSlice({
	name: 'global',
	initialState,
	reducers: {
		showWarningPopUp: (state, action) => {
			state.popup.title = action.payload.title
			state.popup.message = action.payload.message
			state.popup.state = "warning"
			state.popup.show = true

		},
		showSuccessPopUp: (state,action) => {
			state.popup.title = action.payload.title
			state.popup.message = action.payload.message
			state.popup.state = "success"
			state.popup.show = true
		},
		showErrorPopUp: (state, action) => {

			state.popup.title = action.payload.title
			state.popup.message = action.payload.message
			state.popup.state = "error"
			state.popup.show = true
		},
		closePopUp: (state) => {
			state.popup.show = false
		},
		selectedNavItem:(state,action) =>{
			state.selected_nav_item = action.payload
		}
	},
})

// Action creators are generated for each case reducer function
export const { showWarningPopUp,showSuccessPopUp,showErrorPopUp ,closePopUp,selectedNavItem} = globalSlice.actions

export default globalSlice.reducer