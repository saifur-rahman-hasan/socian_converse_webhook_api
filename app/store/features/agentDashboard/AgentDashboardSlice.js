import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_INIT_STATE = {
	loading: false,
	error: null,
	loaded: false,
	data: {}
};

const initialState = {
	loading: true,
	error: null,
	loaded: false,
	percent_complete: 0,
	data: {
		agent: { ...DEFAULT_INIT_STATE },
		agentAuthorization: { ...DEFAULT_INIT_STATE },
		agentAvailabilityStatus: { ...DEFAULT_INIT_STATE },
		agentOnlineStatus: { ...DEFAULT_INIT_STATE },
		agentActiveTask: { ...DEFAULT_INIT_STATE }
	},

};

export const agentDashboardSlice = createSlice({
	name: 'agentDashboardProviderData',
	initialState,
	reducers: {
		updateAgentData: (state, action) => {
			state.data.agent = { ...action.payload };
		},
		updateAgentAuthorization: (state, action) => {
			state.data.agentAuthorization = { ...action.payload };
		},
		updateAgentQueueTasks: (state, action) => {
			state.data.agentQueueTasks = { ...action.payload };
		},
		updateAgentAvailabilityStatus: (state, action) => {
			state.data.agentAvailabilityStatus = { ...action.payload };
		},

		openAgentAvailabilityStatusCommand: (state, action) => {
			state.data.agentAvailabilityStatus.open_command_modal = true
		},

		closeAgentAvailabilityStatusCommand: (state, action) => {
			state.data.agentAvailabilityStatus.open_command_modal = false
		},

		updateAgentOnlineStatus: (state, action) => {
			state.data.agentOnlineStatus = { ...action.payload };
		},
		updateAgentDataLoaded: (state, action) => {
			state.data.loaded = !! action?.payload
		},
		calculatePercentComplete: (state) => {
			const loadedItems = Object.values(state.data).filter((item) => item.loaded);
			const totalItems = Object.values(state.data).length;

			state.percent_complete = totalItems === 0 ? 0 : (loadedItems.length / totalItems) * 100;

			// Update loading and loaded states
			if (state.percent_complete === 100) {
				state.loading = false;
				state.loaded = true;
			} else {
				state.loading = true;
				state.loaded = false;
			}
		},
		updateAgentWorkspaces: (state, action) => {
			state.data.agentWorkspaces = { ...action.payload };
		},

		activateAgentActiveTask: (state, action) => {
			state.data.agentActiveTask = {
				loading: false,
				error: null,
				loaded: true,
				data: { ...action.payload }
			}
		},
		deActivateAgentActiveTask: (state) => {
			state.data.agentActiveTask = DEFAULT_INIT_STATE
		},
		updateAgentActiveTask: (state, action) => {
			state.data.agentActiveTask = { ...action.payload };
		},
	}
});

// Action creators
export const {
	updateAgentDataLoaded,
	updateAgentData,
	updateAgentAuthorization,
	updateAgentQueueTasks,
	updateAgentAvailabilityStatus,
	updateAgentOnlineStatus,
	calculatePercentComplete,
	updateAgentWorkspaces,
	openAgentAvailabilityStatusCommand,
	activateAgentActiveTask,
	deActivateAgentActiveTask,
	updateAgentActiveTask,
} = agentDashboardSlice.actions;

export default agentDashboardSlice;
