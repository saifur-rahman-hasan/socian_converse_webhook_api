import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	dashboard: {
		sidebar_open: false
	}
}

export const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		setSidebarOpenState: (state, action) => {
			state.dashboard.sidebar_open = action?.payload || false
		}
	},
})

// Action creators are generated for each case reducer function
export const { setSidebarOpenState } = themeSlice.actions

export default themeSlice.reducer