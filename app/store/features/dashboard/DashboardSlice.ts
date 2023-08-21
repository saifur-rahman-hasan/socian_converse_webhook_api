import {createSlice} from '@reduxjs/toolkit'
import collect from "collect.js";


interface UserDashboardObjInterface {
	id: string,
	name: string,
	role: string,
	current: boolean
}

const defaultUserDashboard: UserDashboardObjInterface [] = []
const defaultCurrentDashboard: UserDashboardObjInterface | null = null

const initialState = {
	userDashboard: defaultUserDashboard,
	currentDashboard: defaultCurrentDashboard
}

export const DashboardSlice = createSlice({
	name: 'DashboardSlice',
	initialState,
	reducers: {
		initializeUserDashboardList(state, action) {
			state.userDashboard = action?.payload?.userDashboard || []
		},

		activateUserCurrentDashboard(state, action) {
			const updatedUserDashboardList = collect(state.userDashboard)
				.map(item => {
					return {
						...item,
						current: item.id === action?.payload?.id
					}
				}).all()

			state.userDashboard = updatedUserDashboardList || []
			state.currentDashboard = {...action.payload, current: true}
		}
	},
})

// Action creators are generated for each case reducer function
export const {
	initializeUserDashboardList,
	activateUserCurrentDashboard
} = DashboardSlice.actions

export default DashboardSlice.reducer