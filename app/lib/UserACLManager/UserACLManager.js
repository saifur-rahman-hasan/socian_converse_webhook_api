import prisma from "@/lib/prisma";
import collect from "collect.js";

export default class UserACLManager {
    constructor(userId = null) {
        this.setUserId(userId)
    }

    setUserId(userId = null) {
        this.userId = userId
        return this
    }

    getUserId() {
        return this.userId
    }

    async createPermission(name, guard_name) {
        const permission = await prisma.Permission.create({
            data: { name: name, guardName: guard_name },
        })
        return permission;
    }
    
    async getAllPermission() {
        const permissions = await prisma.Permission.findMany()
        return permissions;
    }

    async getPermissionById(permission_id) {
        const permission = await prisma.Permission.findUnique({
            where:{
                id: permission_id
            }
        })

        if (!permission) {
            throw new Error(`Permission with ID ${permission_id} not found.`);
        }

        return permission;
    }

    async createRole(name, guard_name) {
        const role = await prisma.Role.create({
            data: { name: name, guardName: guard_name },
        })
        return role;
    }
    
    async getAllRole() {
        const roles = await prisma.Role.findMany({
            include:{
                roleHasPermissions:{
                    include:{
                        permission: true,
                    }
                },
            }
        })
        return roles;
    }

    async getRoleById(role_id) {
        const role = await prisma.Permission.findUnique({
            where:{
                id: role_id
            }
        })

        if (!role) {
            throw new Error(`Role with ID ${role_id} not found.`);
        }

        return role;
    }
    
    async getPermissionsForRole(role_id) {
        const role = await prisma.RoleHasPermission.findMany({
            where:{
                roleId: role_id
            },
            include:{
                role:true,
                permission:true,
            }
        })

        if (!role) {
            throw new Error(`Role with ID ${role_id} not found.`);
        }

        return role;
    }
    
    async revokePermissionForRole(role_id,permission_id) {

        const findRoleWithPermission = await prisma.RoleHasPermission.findFirst({
            where:{
                roleId: role_id,
                permissionId: permission_id
            }
        })
        
        if (!findRoleWithPermission) {
            throw new Error(`Role ID ${role_id} with Permission ID ${permission_id} not found.`);
        }else{

            await prisma.RoleHasPermission.delete({
                where: {
                    id: findRoleWithPermission.id
                }
            });

            return { success: true };
        }
    }

    async assignPermissionToRole(permissionId, roleId) {

        await prisma.RoleHasPermission.create({
            data: {
                permissionId: parseInt(permissionId),
                roleId: parseInt(roleId),
            },
        })

        return { success: true };
    }

    async assignRoleToModel(roleId, model, modelId) {
        const modelRole = await prisma.ModelHasRole.create({
            data: {
                roleId: roleId,
                modelType: model,
                modelId: modelId,
            },
        })

        return modelRole;
    }

    async getRolesAndPermissionsForModel(model,modelId) {

    }

    // List of Roles Assigned to model.
    async getRolesForModel(model,modelId) {
        const modelRoles = await prisma.ModelHasRole.findMany({
            where: {
                modelType: model,
                modelId: modelId,
            },
            include:{
                role:true,
            }
        })

        const allRoles = new Promise((resolve, reject) => {
			const mappedArray = modelRoles.map(modelRole => {
				return modelRole?.role;
			})
			resolve(mappedArray);
		});

        return allRoles;
    }

    // Revoke Role Assigned to model.
    async revokeRoleForModel(model,modelId,roleId) {
        const findRoleForModel = await prisma.ModelHasRole.findFirst({
            where:{
                modelType: model,
                modelId: modelId,
                roleId: roleId,
            }
        })
        
        if (!findRoleForModel) {
            throw new Error(`Role ID ${roleId} with modelId ${modelId} of model ${model} not found.`);
        }else{

            await prisma.ModelHasRole.delete({
                where: {
                    id: findRoleForModel.id
                }
            });

            return { success: true };
        }
    }
    
    async assignPermissionToModel(permissionId, model, modelId) {
        const modelRole = await prisma.ModelHasPermission.create({
            data: {
                permissionId: permissionId,
                modelType: model,
                modelId: modelId,
            },
        })

        return modelRole;
    }

    async getPermissionsForModel(model,modelId) {
        const modelPermissions = await prisma.ModelHasPermission.findMany({
            where: {
                modelType: model,
                modelId: modelId,
            },
            include:{permission:true}
        })

        const allPermission = new Promise((resolve, reject) => {
			const mappedArray = modelPermissions.map(modelPermission => {
				return modelPermission?.permission;
			})
			resolve(mappedArray);
		});

        return allPermission;
    }
    
    async revokePermissionForModel(model,modelId,permissionId) {
        const findPermissionForModel = await prisma.ModelHasPermission.findFirst({
            where:{
                modelType: model,
                modelId: modelId,
                permissionId: permissionId,
            }
        })
        
        if (!findPermissionForModel) {
            throw new Error(`Permission ID ${permissionId} with modelId ${modelId} of model ${model} not found.`);
        }else{

            await prisma.ModelHasPermission.delete({
                where: {
                    id: findPermissionForModel.id
                }
            });

            return { success: true };
        }
    }

    async getUserAllRolesAndPermissions() {
        const userId = this.getUserId()

        const userRoles = await prisma.ModelHasRole.findMany({
            where: {
                modelType: 'user',
                modelId: userId,
            },
            include:{
                role:{
                    select: {
                        id:true,
                        name:true,
                        guardName:true,
                        roleHasPermissions: {
                            include:{
                                permission:{
                                    select:{
                                        id:true,
                                        name:true,
                                        guardName:true,
                                    }
                                }
                            }
                        },
                    }
                }
            }
        })

        const allRoles = collect(userRoles).pluck("role").map(role =>{
            const { id, name, guardName } = role;
            return { id, name, guardName };
        }).all()
        
        let userPermissionsArray = []
        
        // Get Permissions From UserRoles and push to userPermissionsArray.
        userRoles.map(modelPermission => modelPermission?.role?.roleHasPermissions)
            .flat()
            .map(permission => userPermissionsArray.push(permission.permission));

        const modelPermissions = collect(userRoles).pluck("role").pluck("roleHasPermissions").map(permission => {
            return collect(permission).pluck("permission").all()
        }).collapse().unique("id").values().all()

        const userPermissions = await prisma.ModelHasPermission.findMany({
            where: {
                modelType: 'user',
                modelId: userId,
            },
            include:{
                permission:{
                    select:{
                        id:true,
                        name:true,
                        guardName:true,
                    }
                }
            }
        })
        
        // Get Permissions From userPermissions and push to userPermissionsArray.
        userPermissions.map(permission => userPermissionsArray.push(permission?.permission))

        return {
            roles: allRoles,
            permissions: userPermissionsArray,
        };
    }
}
