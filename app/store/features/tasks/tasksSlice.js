import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    assign_task_modal: {
        isOpen: false,
        thread_id:undefined,
        workspaceId:undefined,
        data:{
            thread:{},
            team_member_list:{},
            task_details:{},
        },
        // formData:{
        //     type:'create', // assign,forward
        //     threadId:undefined,
        //     agentId:undefined,
        //     fromAgentId:undefined,
        //     toAgentId:undefined
        // }
    },
}

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        openAssignTaskModal: (state, action) => {
            state.assign_task_modal.isOpen = true;
            state.assign_task_modal.thread_id= action.payload.thread_id;
            state.assign_task_modal.workspaceId= action.payload.workspaceId;

        },
        closeAssignTaskModal: (state) => {
            state.assign_task_modal.isOpen = false;
            state.assign_task_modal.thread_id= undefined;
            state.assign_task_modal.workspaceId= undefined;
        },
    },
});

export const {openAssignTaskModal, closeAssignTaskModal, updateAssignTaskFormData} = tasksSlice.actions;

export default tasksSlice.reducer;