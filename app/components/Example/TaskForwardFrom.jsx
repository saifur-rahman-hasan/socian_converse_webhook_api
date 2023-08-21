import { useState } from "react";
import Dropdown from "./Dropdown";

const assignFromAgents = [{ id: 1, name: "Ahnaf Adib" }];
const agent = [
  { id: 1, name: "Atikur Rahman" },
  { id: 2, name: "Parvez Rahman Partho" },
  { id: 3, name: "Shahidul Islam" },
  { id: 4, name: "Mustafa Nure Alam" },
  { id: 5, name: "Riju Ahmed" },
  { id: 6, name: "Azmain Islam" },
  { id: 7, name: "Tanvir Hasan Sowrav" },
  { id: 8, name: "Ariful Islam" },
  { id: 9, name: "Niloy Kumar Roy" },
];

export default function TaskForwardFrom({ setOpen }) {
  const [selectedForwardAgent, setSelectedForwardAgent] = useState(null);
  const [selectedFromAgent, setSelectedFromAgent] = useState(
    assignFromAgents[0]
  );
  const [taskAssign, setTaskAssign] = useState(null);

  const handleSave = () => {
    const taskAssignData = {
      selectedForwardAgent: selectedForwardAgent,
      selectedFromAgent: selectedFromAgent,
    };
    setTaskAssign(taskAssignData);
    setOpen(false);

    agentAvailabilityStatusFormData(taskAssignData);
  };
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" action="#" method="POST">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            From agent
          </label>
          <div className="mt-2">
            <Dropdown
              data={assignFromAgents}
              placeholder={"Agent Name"}
              item={selectedFromAgent}
              setItem={setSelectedFromAgent}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Forward to agent
          </label>
          <div className="mt-2">
            <Dropdown
              data={agent}
              placeholder={"Select your agent"}
              item={selectedForwardAgent}
              setItem={setSelectedForwardAgent}
            />
          </div>
        </div>

        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleSave}
          >
            Forward Task
          </button>
        </div>
      </form>
    </div>
  );
}
