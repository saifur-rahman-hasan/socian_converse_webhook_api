import React from "react";

export default function MessengerLeftSidebar({ children }){
	return (
		<div className="w-1/4 bg-gray-200/70 h-screen overflow-y-auto border-r border-gray-400 ">
			{ children }
		</div>
	)
}