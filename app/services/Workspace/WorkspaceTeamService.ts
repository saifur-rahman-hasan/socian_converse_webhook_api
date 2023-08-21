import prisma from "@/lib/prisma";

class WorkspaceTeamService {
    protected db_prisma
    private readonly userId: number;
    private readonly workspaceId: number;

    constructor(userId: number, workspaceId: number) {
        this.userId = userId;
        this.workspaceId = workspaceId;
        this.db_prisma = prisma
    }

    /**
     * Create a single team
     *
     * @param teamData
     */
    async createTeam(teamData: any): Promise<any> {
        try {
            const workspace = await this.db_prisma.Workspace.findFirstOrThrow({
                where: {
                    id: this.workspaceId,
                    userId: this.userId
                }
            })

            const { name } = teamData

            let team = await this.db_prisma.Team.findFirst({
                where: {
                    workspaceId: workspace.id,
                    name: name
                }
            })

            if(!team){
                team = await prisma.team.create({
                    data: {
                        workspaceId: workspace.id,
                        name: name,
                    }
                })
            }else{
                return Promise.reject({message:"Already Exist!"});
            }

            return Promise.resolve(team);
        }catch (error) {
            return Promise.reject(error);
        }
    }

    // Create multiple teams
    async createTeams(teamsData: any[]): Promise<any[]> {
        try {
            const workspace = await this.db_prisma.workspace.findFirst({
                where: {
                    id: this.workspaceId,
                    userId: this.userId,
                },
            });

            const createdTeams = [];

            for (const teamData of teamsData) {
                const { name } = teamData;

                let team = await this.db_prisma.team.findFirst({
                    where: {
                        workspaceId: workspace.id,
                        name: name,
                    },
                });

                if (!team) {
                    team = await this.db_prisma.team.create({
                        data: {
                            workspaceId: workspace.id,
                            name: name,
                        },
                    });
                }

                createdTeams.push(team);
            }

            return Promise.resolve(createdTeams);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // Update multiple teams
    async updateTeam(teamId: string, updatedData: any): Promise<any> {
        try {
            const team = await this.db_prisma.team.findFirst({
                where: {
                    id: teamId,
                    workspace: {
                        id: this.workspaceId,
                        userId: this.userId,
                    },
                },
            });

            if (!team) {
                throw new Error('Team not found');
            }

            const updatedTeam = await this.db_prisma.team.update({
                where: {
                    id: teamId,
                },
                data: updatedData,
            });

            return Promise.resolve(updatedTeam);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // Delete a single team
    async deleteTeam(teamId: string): Promise<void> {
        try {
            const team = await this.db_prisma.team.findFirst({
                where: {
                    id: teamId,
                    workspace: {
                        id: this.workspaceId,
                        userId: this.userId,
                    },
                },
            });

            if (!team) {
                throw new Error('Team not found');
            }

            await this.db_prisma.team.delete({
                where: {
                    id: teamId,
                },
            });

            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // Add a member to a team
    async addMemberToTeam(teamId: string, userId: string, role: string): Promise<any> {
        try {
            const team = await this.db_prisma.Team.findFirstOrThrow({
                where: {
                    id: teamId,
                    workspace: {
                        id: this.workspaceId,
                        userId: this.userId,
                    },
                },
            });

            if (!team) {
                throw new Error('Team not found');
            }

            const member = await this.db_prisma.TeamMember.create({
                data: {
                    teamId: teamId,
                    userId: userId,
                    role: role,
                },
            });

            return Promise.resolve(member);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // Remove a member from a team
    async removeMemberFromTeam(teamId: string, userId: string): Promise<void> {
        try {
            const member = await this.db_prisma.TeamMember.findFirst({
                where: {
                    teamId: teamId,
                    userId: userId,
                },
            });

            if (!member) {
                throw new Error('Team member not found');
            }

            await this.db_prisma.teaTeamMembermMember.delete({
                where: {
                    teamId: teamId,
                    userId: userId,
                },
            });

            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // Sync team members with provided data
    async syncTeamMembers(teamId: string, memberIds: string[], role: string): Promise<any[]> {
        try {
            const team = await this.db_prisma.team.findFirst({
                where: {
                    id: teamId,
                    workspace: {
                        id: this.workspaceId,
                        userId: this.userId,
                    },
                },
            });

            if (!team) {
                throw new Error('Team not found');
            }

            const currentMembers = await this.db_prisma.TeamMember.findMany({
                where: {
                    teamId: teamId,
                },
            });

            const existingMemberIds = currentMembers.map((member) => member.userId);

            const membersToAdd = memberIds.filter((memberId) => !existingMemberIds.includes(memberId));
            const membersToRemove = existingMemberIds.filter((memberId) => !memberIds.includes(memberId));

            const addedMembers = membersToAdd.map(async (memberId) => {
                const member = await this.db_prisma.TeamMember.create({
                    data: {
                        teamId: teamId,
                        userId: memberId,
                        role: role,
                    },
                });

                return member;
            });

            const removedMembers = membersToRemove.map(async (memberId) => {
                await this.db_prisma.TeamMember.delete({
                    where: {
                        teamId: teamId,
                        userId: memberId,
                    },
                });
            });

            await Promise.all(removedMembers);

            const updatedMembers = [...currentMembers.filter((member) => !membersToRemove.includes(member.userId)), ...addedMembers];

            return Promise.all(updatedMembers);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // Replace all team members with provided data
    replaceTeamMembers(teamId: string, membersData: any[]): void {
        // Implementation logic here
    }

    // Reset all team members to an initial state
    resetTeamMembers(teamId: string): void {
        // Implementation logic here
    }

    // Invite a team member
    inviteTeamMember(teamId: string, memberId: string): void {
        // Implementation logic here
    }

    // Revoke an invitation for a team member
    revokeTeamMemberInvitation(teamId: string, memberId: string): void {
        // Implementation logic here
    }

    // Approve an invited team member
    approveInvitedTeamMember(teamId: string, memberId: string): void {
        // Implementation logic here
    }

    // Block a team member
    blockTeamMember(teamId: string, memberId: string): void {
        // Implementation logic here
    }

    // Additional functions/ideas:

    // Get team details by ID
    getTeamById(teamId: string): any {
        // Implementation logic here
    }

    // Get all teams in the workspace
    getAllTeams(): any[] {
        // Implementation logic here
        return [];
    }

    // Get members of a team
    getTeamMembers(teamId: string): any[] {
        // Implementation logic here
        return [];
    }

    // Get teams that a member belongs to
    getMemberTeams(memberId: string): any[] {
        // Implementation logic here
        return [];
    }

    // Search teams by name or other criteria
    searchTeams(criteria: any): any[] {
        // Implementation logic here
        return [];
    }
}


export default WorkspaceTeamService