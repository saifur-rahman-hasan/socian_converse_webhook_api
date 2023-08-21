import { useSelector } from 'react-redux';
import {debugLog} from "@/utils/helperFunctions";

interface AuthUser {
	authUser: any;
	authUserAclAccess: any;
	isAdmin: boolean;
	isAgent: boolean;
	isSupervisor: boolean;
	isQCManager: boolean;
}

function useAuthUserSlice(): AuthUser {
	const authUserData = useSelector((state: any) => state.AuthUserSlice);
	const authUser = authUserData?.authUser || null;
	const authUserAclAccess = authUserData?.authUserAclAccess || null;
	const isAdmin = authUserData?.isAdmin || false;
	const isAgent = authUserData?.isAgent || false;
	const isSupervisor = authUserData?.isSupervisor || false;
	const isQCManager = authUserData?.isQCManager || false

	return {
		authUser,
		authUserAclAccess,
		isAdmin,
		isAgent,
		isSupervisor,
		isQCManager,
	};
}

export default useAuthUserSlice;
