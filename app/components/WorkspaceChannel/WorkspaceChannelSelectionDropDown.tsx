import MultipleSelectMenu from "@/components/ui/forms/MultipleSelectMenu";
import {useGetWorkspaceChannelsQuery} from "@/store/features/workspace/WorkspaceAPISlice";
import {useEffect, useState} from "react";
import LoadingCircle from "@/components/ui/loading/LoadingCircle";

export default function WorkspaceChannelSelectionDropDown({ workspaceId, onSelected }){

	const [channels, setChannels] = useState([])
	const [searchText, setSearchText] = useState("")

	const {
		data: workspaceChannelsData,
		isSuccess: workspaceChannelsDataFetchSuccess,
		isLoading: workspaceChannelsDataIsLoading
	} = useGetWorkspaceChannelsQuery({
		workspaceId,
		useTransformer: 'QCManagerFilterDropdownDataTransformer'
	}, { skip: !workspaceId, refetchOnMountOrArgChange: true, refetchOnFocus: true })

	useEffect(() => {
		setChannels(
			!workspaceChannelsDataFetchSuccess || !workspaceChannelsData?.length
				? []
				: workspaceChannelsData
		)
	}, [workspaceChannelsDataFetchSuccess, workspaceChannelsData])

	return (
		<div className={`w-52`}>
			{ workspaceChannelsDataIsLoading && <LoadingCircle /> }

			{ !workspaceChannelsDataIsLoading && channels?.length > 0 && (
				<MultipleSelectMenu
					id={`channels`}
					label={'Channels'}
					options={channels}
					onSelected={(channel) => onSelected(channel)}
					displaySelectedPreviewContent={false}
					setSearchText={setSearchText}
				/>
			)}
		</div>
	)
}