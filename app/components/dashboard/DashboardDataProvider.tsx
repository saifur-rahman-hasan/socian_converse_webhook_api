import {useEffect} from "react";
import {useSession} from "next-auth/react";
import {debugLog} from "@/utils/helperFunctions";
import {useGetAuthUserRolesAndPermissionsQuery} from "@/store/features/user/UserAPISlice";
import {auth} from "google-auth-library";
import DashboardAccessModal from "@/components/dashboard/DashboardAccessModal";

interface AuthUserSessionDataInterface {
	id: number;
	name: string;
	email: string;
	image?: string | null
}

export default function DashboardDataProvider({ children }){
	const session = useSession()
	const authUser: any = session.status === 'authenticated' && session?.data?.user
	const authId: number = parseInt(authUser.id)

	const {
		data: AuthUserAclAccessData,
	} = useGetAuthUserRolesAndPermissionsQuery({
		userId: authId
	}, {
		skip: !authId,
		refetchOnMountOrArgChange: true
	})

	return (
		<div id={`dashboardDataProvider`}>
			<DashboardAccessModal />

			{children}
		</div>
	)
}