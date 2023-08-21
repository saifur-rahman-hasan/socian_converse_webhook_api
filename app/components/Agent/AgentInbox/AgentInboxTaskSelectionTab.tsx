import classNames from "@/utils/classNames";

const tabs = [
    {
        id: 'active_task',
        name: 'Active Task',
        count: 0,
        current: true
    },
    {
        id: 'queue_task',
        name: 'Queue Task',
        count: 0,
        current: false
    },
]

export default function AgentInboxTaskSelectionTab({ selectedTab, setSelectedTab }) {

    function handleTabSelected(e, tab) {
        e.preventDefault()
        setSelectedTab(tab)
    }

    return (
        <div>
            <div className="bg-gray-200/60">
                <div className="border-b border-gray-200">
                    <nav className="flex justify-evenly space-x-4 shadow" aria-label="Tabs">
                        {tabs.map((tab: any) => (
                            <a
                                key={`agent_sidebar_task_selection_tab_id__${tab.id}`}
                                href="#"
                                className={classNames(
                                    tab.id === selectedTab?.id
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                                    'flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                                )}
                                aria-current={tab.id === selectedTab?.id ? 'page' : undefined}
                                onClick={e => handleTabSelected(e, tab)}
                            >
                                {tab.name}
                                {tab.count ? (
                                    <span
                                        className={classNames(
                                            tab.current ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                                            'ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block'
                                        )}
                                    >
                                        {tab.count}
                                      </span>
                                ) : null}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}
