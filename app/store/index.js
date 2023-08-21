import {configureStore} from '@reduxjs/toolkit'
import counterSlice from './features/counter/counterSlice'
import appNotificationReducer, {appNotificationSlice} from './features/appNotification/appNotificationSlice'
import draftSlice from './features/draft/draftSlice'

import themeReducer from '@/store/features/theme/themeSlice'
import adminDashboardReducer from "@/store/features/adminDashboard/adminDashboardSlice";
import {AdminDashboardAPISlice} from '@/store/features/adminDashboard/AdminDashboardAPISlice'
import {WorkspaceAPISlice} from '@/store/features/workspace/WorkspaceAPISlice'
import {AclAPISlice} from '@/store/features/accessControlList/AclAPISlice'
import {IntegrationAPISlice} from '@/store/features/integration/IntegrationAPISlice'
import {PricingPlanAPISlice} from '@/store/features/pricingPlan/PricingPlanAPISlice'
import {UserAPISlice} from '@/store/features/user/UserAPISlice'
import {CalendarAPISlice} from '@/store/features/calendarApp/CalendarAPISlice'
import {AuthorizationApiSlice} from '@/store/features/authorization/AuthorizationApiSlice'
import {TasksAPISlice} from '@/store/features/tasks/TasksAPISlice'
import {MessengerAPISlice} from '@/store/features/messenger/MessengerAPISlice'
import {AgentActivityAPISlice} from '@/store/features/reports/agentActivity/AgentActivityAPISlice'
import WorkspaceReducer from '@/store/features/workspace/WorkspaceSlice'
import MessengerInstanceReducer from "@/store/features/messenger/MessengerInstanceSlice";
import globalReducer from "@/store/features/global/globalSlice";
import reportsReducer from "@/store/features/reports/reportsSlice";
import tasksReducer from "@/store/features/tasks/tasksSlice";
import agentDashboardSlice from "@/store/features/agentDashboard/AgentDashboardSlice";
import {AgentDashboardAPISlice} from "@/store/features/agentDashboard/AgentDashboardApiSlice";
import {youtubeAPISlice} from './features/youtube/youtubeAPISlice'
import {dataSynchronizerAPISlice} from "@/store/features/dataSynchronizerPlatform/dataSynchronizerAPISlice";
import { TagsAndTemplatesApiSlice } from '@/store/features/tagsAndTemplates/APISlice'
import { AuthUserSlice } from "@/store/features/user/AuthUserSlice";
import {DashboardSlice} from "@/store/features/dashboard/DashboardSlice";

export default configureStore({
    reducer: {
        [AuthUserSlice.name]: AuthUserSlice.reducer,
        [DashboardSlice.name]: DashboardSlice.reducer,
        [counterSlice.name]: counterSlice.reducer,
        global: globalReducer,
        theme: themeReducer,
        draftSlice: draftSlice,
        reports: reportsReducer,
        tasks: tasksReducer,
        [appNotificationSlice.name]: appNotificationReducer,
        [agentDashboardSlice.name]: agentDashboardSlice.reducer,
        adminDashboard: adminDashboardReducer,
        [AdminDashboardAPISlice.reducerPath]: AdminDashboardAPISlice.reducer,
        [WorkspaceAPISlice.reducerPath]: WorkspaceAPISlice.reducer,
        [AclAPISlice.reducerPath]: AclAPISlice.reducer,
        [IntegrationAPISlice.reducerPath]: IntegrationAPISlice.reducer,
        [PricingPlanAPISlice.reducerPath]: PricingPlanAPISlice.reducer,
        workspace: WorkspaceReducer,
        messengerInstance: MessengerInstanceReducer,
        [UserAPISlice.reducerPath]: UserAPISlice.reducer,
        [AuthorizationApiSlice.reducerPath]: AuthorizationApiSlice.reducer,
        [AgentDashboardAPISlice.reducerPath]: AgentDashboardAPISlice.reducer,
        [TasksAPISlice.reducerPath]: TasksAPISlice.reducer,
        [MessengerAPISlice.reducerPath]: MessengerAPISlice.reducer,
        [AgentActivityAPISlice.reducerPath]: AgentActivityAPISlice.reducer,
        [CalendarAPISlice.reducerPath]: CalendarAPISlice.reducer,
        [dataSynchronizerAPISlice.reducerPath]: dataSynchronizerAPISlice.reducer,

    },

    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(AdminDashboardAPISlice.middleware)
            .concat(WorkspaceAPISlice.middleware)
            .concat(AclAPISlice.middleware)
            .concat(TagsAndTemplatesApiSlice.middleware)
            .concat(IntegrationAPISlice.middleware)
            .concat(PricingPlanAPISlice.middleware)
            .concat(UserAPISlice.middleware)
            .concat(AuthorizationApiSlice.middleware)
            .concat(TasksAPISlice.middleware)
            .concat(MessengerAPISlice.middleware)
            .concat(AgentActivityAPISlice.middleware)
            .concat(AgentDashboardAPISlice.middleware)
            .concat(youtubeAPISlice.middleware)
            .concat(CalendarAPISlice.middleware)
            .concat(dataSynchronizerAPISlice.middleware)
})