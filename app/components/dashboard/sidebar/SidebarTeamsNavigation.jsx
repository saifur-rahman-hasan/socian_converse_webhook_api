import Link from "next/link";
import classNames from "../../../utils/classNames";
import {useGetTeamsQuery} from "../../../store/features/adminDashboard/AdminDashboardAPISlice";
import SidebarTeamCreateFormModal from "./SidebarTeamCreateFormModal";
import SidebarTeamSelectionModal from "./SidebarTeamSelectionModal";
import DefaultSkeleton from "../../ui/Skeleton/DefaultSkeleton";


export default function SidebarTeamsNavigation(){
	const { data: teams , isLoading: teamsQueryLoading, error: teamQueryError } = useGetTeamsQuery({ sort: 'desc', limit: 4 })

	let content = null;

	if(teamsQueryLoading){
		content = <DefaultSkeleton className={`my-5`} />
	}

	if(!teamsQueryLoading && teamQueryError){
		content = <div>Error : {teamQueryError}</div>
	}

	if(!teamsQueryLoading && !teamQueryError && teams?.length < 1){
		content = <div>No Data found</div>
	}

	if(!teamsQueryLoading && !teamQueryError && teams?.length > 0){
		content = (
			<div className="mt-1 space-y-1" role="group" aria-labelledby="desktop-teams-headline">
				{teams.map((team) => (
					<Link
						key={team._id}
						href={team?.href || '/not-found'}
						className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
					>
						<span
							className={classNames(
								team.bgColorClass || 'bg-gray-400',
								'w-2 h-2 mr-4 rounded-full'
							)}
							aria-hidden="true"
						/>
						<span className="truncate">{team.name}</span>
					</Link>
				))}

				<SidebarTeamSelectionModal />
			</div>
		)
	}

	return (
		<div>
			<h3 className="px-3 text-sm font-medium text-gray-500 flex items-center justify-between" id="desktop-teams-headline">
				<span>Your Teams</span>

				<SidebarTeamCreateFormModal />
			</h3>

			{ content }

		</div>
	)
}