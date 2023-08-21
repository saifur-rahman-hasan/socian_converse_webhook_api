import { createSlice } from '@reduxjs/toolkit'
import {BriefcaseIcon, UserGroupIcon, HomeIcon} from "@heroicons/react/24/outline";

const navigation = [
	{ name: 'Home', href: '/dashboard', current: true },
	{ name: 'Workspaces', href: '/dashboard/workspaces', current: false },
	{ name: 'Teams', href: '/dashboard/teams', current: false },
]

const teams = [
	{ name: 'Engineering', href: '#', bgColorClass: 'bg-indigo-500' },
	{ name: 'Human Resources', href: '#', bgColorClass: 'bg-green-500' },
	{ name: 'Customer Success', href: '#', bgColorClass: 'bg-yellow-500' },
]

const initialState = {
	navigation: navigation,
	teams: teams
}

export const adminDashboardSlice = createSlice({
	name: 'adminDashboard',
	initialState,
	reducers: {},
})

// Action creators are generated for each case reducer function
// export const { setSidebarOpenState } = themeSlice.actions

export default adminDashboardSlice.reducer