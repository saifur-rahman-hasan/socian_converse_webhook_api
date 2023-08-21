import {createSlice} from '@reduxjs/toolkit'
import collect from "collect.js";

const DEFAULT_WORKSPACE_INTERFACE = {
	active: false,
	name: null,
	about: null,
	brand_logo: null,
	plan: null,
	plan_payment_callback_id: null,
	plan_payment_paid: false,
	teams: null,
	integrations: null
}

const DEFAULT_WORKSPACE_CREATE_STEPS_INTERFACE = [
	{
		id: 'about_workspace',
		name: 'About Workspace',
		description: 'Provide your workspace information',
		href: '/workspaces/create?step=about_workspace',
		status: 'current'
	},
	{
		id: 'plan_and_billing',
		name: 'Plan and Billing',
		description: 'Choose your plan and complete your payment to use workspace',
		href: '/workspaces/create?step=plan_and_billing',
		status: 'upcoming',
	},
	{
		id: 'team',
		name: 'Team',
		description: 'Choose your team to access the workspace.',
		href: '/workspaces/create?step=team',
		status: 'upcoming'
	},
	{
		id: 'integrations',
		name: 'channels',
		description: 'Add your required Integrations',
		href: '/workspaces/create?step=integrations',
		status: 'upcoming'
	}
]

const initialState = {
	workspace_create_steps: DEFAULT_WORKSPACE_CREATE_STEPS_INTERFACE,
	draft_workspace: DEFAULT_WORKSPACE_INTERFACE,
	created_workspace: null
}

export const workspaceSlice = createSlice({
	name: 'workspaceSlice',
	initialState,
	reducers: {
		updateDraftWorkspace: (state, action) => {
			const payloadKeys = Object.keys(action.payload);
			payloadKeys.forEach(key => {
				if (state.draft_workspace.hasOwnProperty(key)) {
					state.draft_workspace[key] = action.payload[key];
				} else {
					state.draft_workspace[key] = action.payload[key];
				}
			});
		},
		updateWorkspaceCreateActiveStep: (state, action) => {
			state.workspace_create_steps = collect(state.workspace_create_steps).map(item => {
				if (item.status === 'current') {
					item.status = action?.payload?.current_step_status
				}

				if (item.status === 'upcoming' && item.id === action?.payload?.next_active_step) {
					item.status = 'current'
				}

				return item
			}).toArray()
		},
		resetWorkspaceCreateActiveStep: (state) => {
			state.workspace_create_steps = DEFAULT_WORKSPACE_CREATE_STEPS_INTERFACE
		}
	},
})

// Action creators are generated for each case reducer function
export const {
	updateDraftWorkspace,
	updateWorkspaceCreateActiveStep,
	resetWorkspaceCreateActiveStep
} = workspaceSlice.actions

export default workspaceSlice.reducer