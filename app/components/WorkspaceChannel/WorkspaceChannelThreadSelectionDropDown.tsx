import {useEffect, useState} from "react";
import {useGetChannelThreadsQuery,useSearchThreadMutation} from "@/store/features/workspace/WorkspaceAPISlice";
import LoadingCircle from "@/components/ui/loading/LoadingCircle";
import MultipleSelectMenu from "@/components/ui/forms/MultipleSelectMenu";
import useQCManagerTaskFilterDraftSlice from "@/hooks/useQCManagerTaskFilterDraftSlice";
import collect from "collect.js";
import Dump from "../Dump";

export default function WorkspaceChannelThreadSelectionDropDown({ workspaceId, onSelected,channels }) {
	const [threads, setThreads] = useState([])
	const [selectedThreads, setSelectedThreads] = useState(onSelected)
	const [searchText, setSearchText] = useState("")
	useEffect(() => {
		onSelected({
			...selectedThreads
		})
	}, [selectedThreads])

	// const filterData = useQCManagerTaskFilterDraftSlice()
	const channelIds = collect(channels || []).pluck('id').toArray()

	const {
		data: workspaceChannelThreadsData,
		isSuccess: workspaceChannelThreadDataFetchSuccess,
		isLoading: workspaceChannelThreadDataIsLoading
	} = useGetChannelThreadsQuery({
		workspaceId,
		channelId: channelIds,
		useTransformer: 'QCManagerFilterDropdownDataTransformer'
	}, { skip: !workspaceId || !channelIds?.length, refetchOnMountOrArgChange: true, refetchOnFocus: true })

	useEffect(() => {
		if(workspaceChannelThreadsData?.length > 0){
			setThreads(workspaceChannelThreadsData)
		}

	}, [workspaceChannelThreadDataFetchSuccess, workspaceChannelThreadsData])	
	
	const [searchThreads, {
		isLoading: searchThreadIsLoading,
		error: searchThreadError
	}] =  useSearchThreadMutation()
	
	async function searchThreadsFn(text){
		const searchResponse = await searchThreads({
			searchKey: text,
			workspaceId: workspaceId,
			channelId: channelIds,
			useTransformer: 'QCManagerFilterDropdownDataTransformer'
		})
	}

	useEffect(() => {

		const debounceId = setTimeout(() => {
			if(searchText.length > 0){
				searchThreadsFn(searchText)
			}          
        }, 1000);

        return () => {
            clearTimeout(debounceId);
        };

	}, [searchText])

	return (
		<div className={`w-52`}>
			{ workspaceChannelThreadDataIsLoading && <LoadingCircle /> }

			<MultipleSelectMenu
				id={threads}
				label={'Threads'}
				options={threads}
				// onSelected={(threads) => onSelected(threads)}
				onSelected={setSelectedThreads}
				displaySelectedPreviewContent={false}
				setSearchText={setSearchText}
			/>
		</div>
	)
}