import { useSelector } from 'react-redux';
import {debugLog} from "@/utils/helperFunctions";

interface DashboardSliceData {
	dashboardSlice: any;
	userDashboard: any;
	currentDashboard: any;
}

function useDashboardSlice(): DashboardSliceData {
	const dashboardSlice = useSelector((state: any) => state.DashboardSlice);
	const userDashboard = dashboardSlice?.userDashboard || null;
	const currentDashboard = dashboardSlice?.currentDashboard || null;

	return {
		dashboardSlice,
		userDashboard,
		currentDashboard
	};
}

export default useDashboardSlice;
