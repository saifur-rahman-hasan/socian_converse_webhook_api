import {Fragment, useEffect, useState} from "react";
import {useGetWorkspaceTeamMembersQuery} from "@/store/features/workspace/WorkspaceAPISlice";
import {Combobox, Listbox, Transition} from "@headlessui/react";
import classNames from "@/utils/classNames";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/24/outline";
import Dropdown from "@/components/ui/forms/Dropdown";

const UserSelectionListComponent = ({handleSelectedUser, workspaceId,label="Assign to"}) => {
    const [selectedMember, setSelectedMember] = useState({})

    const [team_member_list, setTeamMemberList] = useState([])
    const {
        data: teamMembers,
        isLoading: teamMembersIsLoading,
        error: teamMembersFetchError,
        refetch: refetchTeamMembers
    } = useGetWorkspaceTeamMembersQuery({
        workspaceId: workspaceId
    }, {skip: !workspaceId})

    useEffect(() => {
        if (teamMembers?.length > 0) {
            setTeamMemberList(teamMembers)
        }
    }, [teamMembers]);

    const [filteredData, setFilteredData] = useState("");



    useEffect(() => {
        handleSelectedUser(selectedMember);
    }, [selectedMember]);

    async function handleUserSelection(data) {
        setSelectedMember(data)
    }

    async function handleInputChange(event) {
        event.preventDefault();
        const query = event.target.value
        const queryData = query === ""
            ? team_member_list
            : team_member_list.filter((item) => {
                const name =  item?.user?.name.toLowerCase().includes(query.toLowerCase());
                const email =  item?.user?.email.toLowerCase().includes(query.toLowerCase());
                return name || email;
            });
        setFilteredData(queryData)
    }

    if (team_member_list?.length) {
        return (
            <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
                <Combobox as="div" value={selectedMember} onChange={(selectedMember)=> handleUserSelection(selectedMember)}>
                    {/*<Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">*/}
                    {/*    Select your agent*/}
                    {/*</Combobox.Label>*/}
                    <div className="relative mt-2">
                        <Combobox.Input
                            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(event) => handleInputChange(event)}
                            placeholder="Select your agent"
                            displayValue={(person) => person?.user?.email}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>

                        {filteredData.length > 0 && (
                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredData.map((item) => (
                                    <Combobox.Option
                                        key={item.id}
                                        value={item}
                                        className={({ active }) =>
                                            classNames(
                                                "relative cursor-default select-none py-2 pl-3 pr-9",
                                                active ? "bg-indigo-600 text-white" : "text-gray-900"
                                            )
                                        }
                                    >
                                        {({ active, selected }) => (
                                            <>
                    <span
                        className={classNames(
                            "block truncate",
                            selected && "font-semibold"
                        )}
                    >
                  {item?.user?.name}
                    <br/>
                    {item?.user?.email}
                    </span>

                                                {selected && (
                                                    <span
                                                        className={classNames(
                                                            "absolute inset-y-0 right-0 flex items-center pr-4",
                                                            active ? "text-white" : "text-indigo-600"
                                                        )}
                                                    >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                                                )}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        )}
                    </div>
                </Combobox>
            </div>
        )
    } else {
        return (<></>)
    }
};

export default UserSelectionListComponent;
