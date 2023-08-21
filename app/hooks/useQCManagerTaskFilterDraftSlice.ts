import {useSelector} from 'react-redux';


function useQCManagerTaskFilterDraftSlice() {
	return useSelector((state: any) => state.draftSlice.QCManagerTaskFilter);
}

export default useQCManagerTaskFilterDraftSlice;
