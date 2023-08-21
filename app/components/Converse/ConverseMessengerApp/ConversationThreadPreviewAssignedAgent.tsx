import { FC, useState } from "react"; // Import FC (Functional Component) type
import { PlusIcon } from "@heroicons/react/20/solid";
import DefaultGravatar from "@/components/DefaultGravatar";
import TaskForwardComponent from "../Tasks/TaskForwardComponent";

// Define the type for the agent prop
interface Agent {
    id: number;
    name: string;
}


// Use FC type with the Agent prop
const ConversationThreadPreviewAssignedAgent: FC<{ agent: Agent }> = ({ agent }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className={`flex items-center justify-between`}>
                <h2 className="text-sm font-medium text-gray-500">Assigned Agent</h2>

                <button onClick={openModal}>
                    <PlusIcon className={`w-4 h-4 text-gray-500`} />
                </button>
            </div>

            <ul role="list" className="mt-3 space-y-3">
                <li className="flex justify-start">
                    <a href="components/Agent/AssignedTask/AgentAssignedActiveTask#" className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            {/* Add type for DefaultGravatar props */}
                            <DefaultGravatar
                                className="h-5 w-5 rounded-full"
                            />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{agent?.name || 'undefined'}</div>
                    </a>
                </li>
            </ul>

            {/* {isModalOpen && <TaskForwardComponent handleSelectedUser={} handleSubmitButton={} handleCancelButton={} workspaceId={} formError={} assigned_user_id={} />} */}
        </div>
    );
}

export default ConversationThreadPreviewAssignedAgent;
