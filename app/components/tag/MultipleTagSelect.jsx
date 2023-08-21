"use client"

import React, { useEffect, useState } from 'react';
import { useGetTagsQuery,useSearchTagsMutation } from '@/store/features/workspace/WorkspaceAPISlice';
import MultipleSelectMenu from '../ui/forms/multipleSelectManu';
import Dump from '../Dump';
import {useRouter} from "next/router";


export default function MultipleTagSelect({ onSelected, channelId  }) {
	const router = useRouter()

	const [searchText, setSearchText] = useState("");
	const [tags, setTagsResponse] = useState([]);
	const [tagsIsLoading, setTagsIsLoading] = useState();
	
	// const {
	// 	data: tagsData,
	// 	isLoading: tagsIsLoadingState
	// } = useGetTagsQuery(page)

	// useEffect(() => {
	// 	setTagsResponse(tagsData?.data);
    //     setTagsIsLoading(tagsIsLoadingState);
    // }, [tagsData, tagsIsLoadingState]);

	const [searchTag, {
		isLoading: searchTagIsLoading,
		error: searchTagError
	}] =  useSearchTagsMutation()

	async function searchTagFn(text){
		const searchResponse = await searchTag({key:text,channelId:channelId||router?.query?.channelId})
		setTagsResponse(searchResponse?.data?.data?.data)
		setTagsIsLoading(searchTagIsLoading)
	}

	useEffect(() => {
		const debounceId = setTimeout(() => {          
			searchTagFn(searchText)
        }, 1000);

        return () => {
            clearTimeout(debounceId);
        };
    }, [searchText])

	return (
        <div>
			{/* <Dump data={router?.query?.channelId}/> */}
			<MultipleSelectMenu label={'Select Tag'} options={tags} onSelected={onSelected} setSearchText={setSearchText}  isLoading={searchTagIsLoading}/>
		</div>
	)
};