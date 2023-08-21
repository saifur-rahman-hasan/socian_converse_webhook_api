import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	user_edit_modal: {
		open: false,
		data: null
	},
}

export const userSlice = createSlice({
	name: 'user_slice',
	initialState,
	reducers: {
		activateUserEdit: (state, action) => {
			state.user_edit_modal.open = true
			state.user_edit_modal.data = action.payload

		},
		deActivateUserEdit: (state, action) => {
			state.user_edit_modal.open = false
			state.user_edit_modal.data = null

		}
	},
})

// Action creators are generated for each case reducer function
export const {
	activateUserEdit,
	deActivateUserEdit,
} = userSlice.actions

export default userSlice.reducer