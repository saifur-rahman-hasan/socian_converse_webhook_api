import {ApiResponse} from "@/lib/ApiResponse";
import {PrismaClient} from "@prisma/client";

export default class WorkspaceResourceRepository {
	constructor(prisma) {
		const prismaInstance = prisma || new PrismaClient();
		this.prisma = prisma;
	}

	async getWorkspaces(req, res) {
		try {
			const workspaces = await this.prisma.workspace.findMany();
			ApiResponse.success(res, workspaces);
		} catch (error) {
			console.error(error);
			ApiResponse.error(res, error.message || 'Failed to retrieve workspaces');
		}
	}

	async createWorkspace(req, res) {
		try {
			const { name: workspace_name, userId } = req.body;

			// Find the user
			const user = await this.prisma.user.findFirstOrThrow({
				where: {
					id: userId,
				},
			});

			// Create a workspace
			const workspace = await this.prisma.workspace.create({
				data: {
					name: workspace_name,
					user: {
						connect: { id: user.id }, // Connect the workspace to the user as the creator
					},
					teams: {
						create: [
							{
								name: 'My Team',
								members: {
									create: [
										{
											user: {
												connect: { id: user.id }, // Connect the user as a member
											},
											role: 'Admin', // Set the user as the team admin
										},
									],
								},
							},
						],
					},
				},
				include: {
					teams: true, // Include the created teams in the response
				},
			});

			ApiResponse.created(res, 'Your workspace has been created.', workspace);
		} catch (error) {
			console.error(error);
			ApiResponse.error(res, error.message);
		}
	}

	async getWorkspaceById(req, res) {
		try {
			const { workspaceId } = req.query;

			const workspace = await this.prisma.workspace.findUnique({
				where: { id: Number(workspaceId) },
			});

			if (!workspace) {
				ApiResponse.notFound(res, 'Workspace not found', null);
				return;
			}

			sendSuccessResponse(res, workspace);
		} catch (error) {
			console.error(error);
			ApiResponse.error(res, 'Failed to retrieve workspace');
		}
	}

	async updateWorkspace(req, res) {
		try {
			const { workspaceId } = req.query;
			const { name } = req.body;

			const updatedWorkspace = await this.prisma.workspace.update({
				where: { id: Number(workspaceId) },
				data: { name },
			});

			ApiResponse.success(res, updatedWorkspace);
		} catch (error) {
			console.error(error);
			ApiResponse.error(res, 'Failed to update workspace');
		}
	}

	async deleteWorkspace(req, res) {
		try {
			const { id } = req.query;

			await this.prisma.workspace.delete({
				where: { id: Number(id) },
			});

			ApiResponse.deleted(res);
		} catch (error) {
			console.error(error);
			ApiResponse.error(res, 'Failed to delete workspace');
		}
	}
}
