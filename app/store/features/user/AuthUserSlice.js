import { createSlice } from '@reduxjs/toolkit'

const DEFAULT_STATE = {
	authUser: null,
	authUserAclAccess: null,
	isAdmin: false,
	isSupervisor: false,
	isQCManager: false,
	isAgent: false,
}

const initialState = DEFAULT_STATE

export const AuthUserSlice = createSlice({
	name: 'AuthUserSlice',
	initialState,
	reducers: {
		activateAuthUser: (state, action) => {
			state.authUser = action?.payload?.authUser || null
			state.authUserAclAccess = action?.payload?.authUserAclAccess || null
			state.isAgent = action?.payload?.isAgent || false
			state.isSupervisor = action?.payload?.isSupervisor || false
			state.isAdmin = action?.payload?.isAdmin || false
			state.isQCManager = action?.payload?.isQCManager || false
		},
		inActivateAuthUser: (state, action) => {
			state = DEFAULT_STATE
		}
	},
})

// Action creators are generated for each case reducer function
export const {
	activateAuthUser,
	inActivateAuthUser,
} = AuthUserSlice.actions

export default AuthUserSlice.reducer