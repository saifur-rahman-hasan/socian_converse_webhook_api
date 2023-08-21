function startActivity(workspaceId,agentId,activityType,activityInfo){
	createAgentActivity({
		"workspaceId": workspaceId,
		"agentId": agentId,
		"channelId": null,
		"conversationId": null,
		"threadId":null,
		"activityType":activityType,
		"activityInfo":activityInfo,
		"activityState":"start"
	})
}
function stopActivity(workspaceId,agentId,activityType,activityInfo){
	startActivity(workspaceId,agentId,activityType,activityInfo);
	createAgentActivity({
		"workspaceId": workspaceId,
		"agentId": agentId,
		"channelId": null,
		"conversationId": null,
		"threadId":null,
		"activityType":activityType,
		"activityInfo":activityInfo,
		"activityState":"end"
	})
}
