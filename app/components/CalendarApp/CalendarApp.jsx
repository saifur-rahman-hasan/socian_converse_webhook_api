"use client"

import CalendarAppHeader from "./CalendarAppHeader";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from '@fullcalendar/list';
import {useGetAgentCalenderEventQuery} from "@/store/features/calendarApp/CalendarAPISlice";
import DefaultSkeleton from "@/components/ui/Skeleton/DefaultSkeleton";
import Dump from "@/components/Dump";




export default function CalendarApp({ workspaceId }) {
	const {
		isLoading: calendarAppDataIsLoading,
		data: calendarAppData,
		error: calendarAppDataError,
	} = useGetAgentCalenderEventQuery({ workspaceId }, {skip: workspaceId});

	return (
		<div className="flex h-full flex-col">
			<CalendarAppHeader />

			{ calendarAppDataIsLoading && <DefaultSkeleton className={`my-4`} /> }

			{ !calendarAppDataIsLoading && calendarAppDataError && <Dump data={{calendarAppDataError}} /> }
			{
				!calendarAppDataIsLoading &&
				!calendarAppDataError &&
				calendarAppData && (
					<FullCalendar
						plugins={[
							dayGridPlugin,
							timeGridPlugin,
							listPlugin
						]}
						initialView={`timeGridDay`}
						eventContent={renderEventContent}
						nowIndicator={true}
						selectable={true}
						selectMirror={true}
						slotMinTime="09:00:00"
						slotMaxTime="20:00:00"
						events={calendarAppData}
						timeZone={'Asia/Dhaka'}
					/>
				)
			}


		</div>
	);
}



// a custom render function
function renderEventContent(eventInfo) {
	return (
		<>
			<b>{eventInfo.timeText}</b>
			<i>{eventInfo.event.title}</i>
		</>
	)
}