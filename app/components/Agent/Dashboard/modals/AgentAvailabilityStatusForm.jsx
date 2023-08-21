import {useEffect, useState} from "react";
import {RadioGroup} from "@headlessui/react";
import {CheckCircleIcon} from "@heroicons/react/20/solid";
import classNames from "@/utils/classNames";
import Dropdown from "@/components/ui/forms/Dropdown";
import AlertError from "@/components/ui/alerts/AlertError";
import {useCreateAgentActivityMutation} from "@/store/features/reports/agentActivity/AgentActivityAPISlice";
import LoadingCircle from "@/components/ui/loading/LoadingCircle";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {
  openAgentAvailabilityStatusCommand,
  updateAgentAvailabilityStatus
} from "@/store/features/agentDashboard/AgentDashboardSlice";
import MessengerChannelSelection from "@/components/Converse/ConverseMessengerApp/MessengerChannelSelection";


const availabilityList = [
  { id: 'available', title: 'Available', description: 'Available to receive task' },
  { id: 'unavailable', title: 'Unavailable', description: 'Unavailable to receive task' },
  { id: 'break', title: 'Break', description: 'Lets take a break' },
]

const breakTypeList = [
  { id: 1, name: "Tea Break" },
  { id: 2, name: "Lunch Break" },
  { id: 3, name: "Prayer Break" },
  { id: 4, name: "Smoking Break" },
  { id: 5, name: "Snack break" },
  { id: 6, name: "Stretching break" },
  { id: 7, name: "Walking break" },
  { id: 8, name: "Reading break" },
  { id: 9, name: "Music break" },
  { id: 10, name: "Nature break" },
];
const breakDurationList = [
  { id: 1, name: "5 Minutes" },
  { id: 2, name: "10 Minutes" },
  { id: 3, name: "15 Minutes" },
  { id: 4, name: "20 Minutes" },
  { id: 5, name: "25 Minutes" },
  { id: 6, name: "30 Minutes" },
];

export default function AgentAvailabilityStatusForm({ workspaceId, agentId, loadedAvailabilityStatus,channels }) {
  const router = useRouter()
  const dispatch = useDispatch()

  const [selectedAvailabilityType, setSelectedAvailabilityType] = useState(null);
  const [breakNote, setBreakNote] = useState("");
  const [unavailableNote, setUnavailableNote] = useState("");
  const [selectedBreakType, setSelectedBreakType] = useState(null);
  const [selectedBreakDuration, setSelectedBreakDuration] = useState(null);
  const [formError, setFormError] = useState(null);
  const [agentAvailabilityStatusFormData, setAgentAvailabilityStatusFormData] = useState({});
  const [
    selectedChannel,
    setSelectedChannel
  ] = useState(channels)

  const [createAgentActivity, {
    isLoading: agentActivityIsCreating,
    isSuccess: agentActivityIsCreated
  }]= useCreateAgentActivityMutation()


  useEffect(() => {
    let updatedData = {}

    if(selectedAvailabilityType?.id === 'unavailable' && unavailableNote?.length > 0){
      updatedData.unavailableNote = unavailableNote
    }

    if(selectedAvailabilityType?.id === 'break' && breakNote?.length > 0){
      updatedData.breakNote = breakNote
    }

    if(selectedAvailabilityType?.id === 'break' && selectedBreakType?.id > 0){
      updatedData.breakType = selectedBreakType
    }

    if(selectedAvailabilityType?.id === 'break' && selectedBreakDuration?.id > 0){
      updatedData.breakDuration = selectedBreakDuration
    }

    const updatedFormData = {
      ...agentAvailabilityStatusFormData,
      ...updatedData
    }

    setAgentAvailabilityStatusFormData(updatedFormData)
  }, [selectedAvailabilityType, unavailableNote, breakNote, selectedBreakType, selectedBreakDuration])

  useEffect(() => {
    const idToFind = loadedAvailabilityStatus?.status;

    const statusObj = availabilityList.find(item => item.id === idToFind || null)
    setSelectedAvailabilityType(statusObj)

    if(idToFind === 'unavailable'){
      setUnavailableNote(statusObj?.unavailableNote || '')
    }

    if(idToFind === 'break'){
      setBreakNote(statusObj?.breakNote || '')
      setSelectedBreakType(statusObj?.breakType || '')
      setSelectedBreakDuration(statusObj?.breakDuration || '')
    }

  }, [loadedAvailabilityStatus])

  const handleAvailabilityStatusSelection = (selectedItem) => {

    // Prepare form data object with selected status
    let formData = {
      status: selectedItem.id,
    };

    // Handle special cases based on selected status
    if (selectedItem.id === 'unavailable') {
      // For 'unavailable' status, set unavailableNote to null
      formData = {
        ...formData,
        unavailableNote: null,
      };
    }


    if (selectedItem.id === 'break') {
      // For 'break' status, reset additional break-related fields
      formData = {
        ...formData,
        breakType: null,
        breakDuration: null,
        breakNote: null,
      };
    }

    setAgentAvailabilityStatusFormData(formData)

    setSelectedAvailabilityType(selectedItem);
  };

  const handleSave = async (e) => {
    e.preventDefault()
    const formData = agentAvailabilityStatusFormData

    if(formData?.status === 'available'){
      if (!selectedChannel){
        setFormError("Please Select Channel")
        return false
      }else{
        formData.channelData = {
          id: selectedChannel?.id,
          channelId: selectedChannel?.channelData?.accountId,
          name: selectedChannel?.channelData?.name
        }
      }

    }

    if(formData?.status === 'unavailable' && !formData?.unavailableNote?.length){
      setFormError("Please enter unavailable note")
      return false
    }

    if(formData?.status === 'break' && !formData?.breakNote?.length){
      setFormError("Please enter break note")
      return false
    }

    if(formData?.status === 'break' && !formData?.breakType?.id){
      setFormError("Please select your break type")
      return false
    }

    if(formData?.status === 'break' && !formData?.breakDuration?.id){
      setFormError("Please select your break duration")
      return false
    }

    if(loadedAvailabilityStatus?.status === formData?.status){
      setFormError("Selected availability status already active.")
      return false
    }

    await createAgentActivity({
      workspaceId: workspaceId,
      channelId: formData?.channelData?.id,
      agentId: agentId,
      activityGroup: `availability_status`,
      activityType: formData?.status,
      activityInfo: "Agent has changed the Availability Status",
      activityState: "start",
      activityData: formData
    })

    dispatch(
        updateAgentAvailabilityStatus({
          ...loadedAvailabilityStatus,
          data: {...formData}
        })
    )

    if(formData.status !== 'available'){
      dispatch(openAgentAvailabilityStatusCommand())
    }

  };

  return (
      <form onSubmit={handleSave}>
        <RadioGroup value={selectedAvailabilityType} onChange={handleAvailabilityStatusSelection}>
          <div className="mt-4 grid grid-cols-1 gap-y-3 sm:grid-cols-1 sm:gap-x-4">
            {availabilityList.map((availability, index) => (
                <>
                  <RadioGroup.Option
                      key={`availabilityId:${availability.id}`}
                      value={availability}
                      className={({ active }) =>
                          classNames(
                              active
                                  ? "border-indigo-600 ring-2 ring-indigo-600"
                                  : "border-gray-300",
                              "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
                          )
                      }
                  >
                    {({ checked, active }) => (
                        <>
                          <div className="flex flex-1">
                            <div className="flex flex-col">
                              <RadioGroup.Label
                                  as="span"
                                  className="block text-sm font-medium text-gray-900"
                              >
                                {availability.title}
                              </RadioGroup.Label>
                              <RadioGroup.Label
                                  as="span"
                                  className="mt-1 flex items-center text-sm text-gray-500"
                              >
                                {availability.description}
                              </RadioGroup.Label>
                            </div>
                          </div>
                          <CheckCircleIcon
                              className={classNames(
                                  !checked ? "invisible" : "",
                                  "h-5 w-5 text-indigo-600"
                              )}
                              aria-hidden="true"
                          />
                          <span
                              className={classNames(
                                  active ? "border" : "border-2",
                                  checked ? "border-indigo-600" : "border-transparent",
                                  "pointer-events-none absolute -inset-px rounded-lg"
                              )}
                              aria-hidden="true"
                          />
                        </>
                    )}
                  </RadioGroup.Option>
                </>
            ))}
          </div>

          {/* Form Content */}
          <div className={`mt-10`}>
            {selectedAvailabilityType?.id === "available" && (
                <div className="mt-2">

                  <div className={`my-4`}>
                    <MessengerChannelSelection
                        channels={channels}
                        onSelect={setSelectedChannel}
                    />
                  </div>
                </div>
            )}


            {selectedAvailabilityType?.id === "unavailable" && (
                <div className="mt-2">
                  <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
                    Unavailable Note
                  </label>

                  <div className="mt-2">
                      <textarea
                          rows={4}
                          name="comment"
                          id="comment"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          defaultValue={''}
                          value={unavailableNote}
                          placeholder="Enter a reason for being unavailable"
                          onChange={e => setUnavailableNote(e.target.value)}
                      />
                  </div>
                </div>
            )}

            {selectedAvailabilityType?.id === "break" && (
                <div className="mt-2">

                  <div className={`my-4`}>
                    <Dropdown
                        id={'breakType'}
                        data={breakTypeList}
                        placeholder={"Break Type"}
                        item={selectedBreakType}
                        setItem={setSelectedBreakType}

                    />
                  </div>

                  <div className={`my-4`}>
                    <Dropdown
                        id={'breakDuration'}
                        data={breakDurationList}
                        placeholder={"Break Duration"}
                        item={selectedBreakDuration}
                        setItem={setSelectedBreakDuration}
                        clasName={`mb-4`}
                    />
                  </div>


                  <div className={`mt-4`}>
                    <label htmlFor="breakNote" className="block text-sm font-medium leading-6 text-gray-900">
                      Break Note
                    </label>

                    <div className="mt-2">
                        <textarea
                            rows={4}
                            name="breakNote"
                            id="breakNote"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            defaultValue={''}
                            value={breakNote}
                            placeholder="Enter a reason for taking break"
                            onChange={e => setBreakNote(e.target.value) }
                        />
                    </div>
                  </div>
                </div>
            )}
          </div>

          {
            formError?.length >  0 && <AlertError
              className={`my-4`}
              title={'Availability Status Error'}
              message={formError}
              type={'error'}
            />
          }

          {
            agentActivityIsCreated && <div>New Activity recorded</div>
          }

          {
              agentActivityIsCreating && <LoadingCircle />
          }

          {
            selectedAvailabilityType?.id && (
                <div className="mt-4">
                  <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={handleSave}
                  >
                    Save & Continue
                  </button>
                </div>
              )
          }
        </RadioGroup>
      </form>
  );
}
