const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


async function seed() {

	// TODO - 01: setupSystemAdminDefaultRolesAndPermissions
	await setupSystemAdminDefaultRolesAndPermissions()

	// TODO - 02: setupSuperAdminDefaultRolesAndPermissions
	await setupSuperAdminDefaultRolesAndPermissions()

	// TODO - 03: setupAdminDefaultRolesAndPermissions
	await setupAdminDefaultRolesAndPermissions()

	// TODO - 04: setupSupervisorDefaultRolesAndPermissions
	await setupSupervisorDefaultRolesAndPermissions()

	// TODO - 05: setupAgentDefaultRolesAndPermissions
	await setupAgentDefaultRolesAndPermissions()


	prisma.$disconnect();
}

async function setupSystemAdminDefaultUserWithRolesAndPermissions(roleId) {
	const user = await prisma.user.create({
		data: {
			name: 'System Admin',
			email: 'system-admin@socian.ai'
		}
	})

	await prisma.ModelHasRole.create({
		data: {
			roleId: roleId,
			modelType: 'user',
			modelId: user.id
		}
	})
}

async function setupSuperAdminDefaultUserWithRolesAndPermissions(roleId) {
	const user = await prisma.user.create({
		data: {
			name: 'Super Admin',
			email: 'super-admin@socian.ai'
		}
	})

	await prisma.ModelHasRole.create({
		data: {
			roleId: roleId,
			modelType: 'user',
			modelId: user.id
		}
	})
}

async function setupAdminDefaultUserWithRolesAndPermissions(roleId) {
	const user = await prisma.user.create({
		data: {
			name: 'Admin',
			email: 'admin@socian.ai'
		}
	})

	await prisma.ModelHasRole.create({
		data: {
			roleId: roleId,
			modelType: 'user',
			modelId: user.id
		}
	})
}

async function setupSupervisorDefaultUserWithRolesAndPermissions(roleId) {
	const user = await prisma.user.create({
		data: {
			name: 'Supervisor',
			email: 'supervisor@socian.ai'
		}
	})

	await prisma.ModelHasRole.create({
		data: {
			roleId: roleId,
			modelType: 'user',
			modelId: user.id
		}
	})
}

async function setupAgentDefaultUserWithRolesAndPermissions(roleId) {
	const user = await prisma.user.create({
		data: {
			name: 'Agent',
			email: 'agent@socian.ai'
		}
	})

	await prisma.ModelHasRole.create({
		data: {
			roleId: roleId,
			modelType: 'user',
			modelId: user.id
		}
	})
}

async function setupSystemAdminDefaultRolesAndPermissions() {
	const role = await prisma.Role.create({
		data: { name: 'SystemAdmin', guardName: 'web' },
	})

	const permission = await prisma.Permission.create({
		data: { name: 'system_admin_dashboard_access', guardName: 'web' }
	})

	await prisma.RoleHasPermission.create({
		data: {
			permissionId: permission.id,
			roleId: role.id
		}
	})

	await setupSystemAdminDefaultUserWithRolesAndPermissions(role.id)
}

async function setupSuperAdminDefaultRolesAndPermissions() {
	const role = await prisma.Role.create({
		data: { name: 'SuperAdmin', guardName: 'web' },
	})

	const permission = await prisma.Permission.create({
		data: { name: 'super_admin_dashboard_access', guardName: 'web' }
	})

	await prisma.RoleHasPermission.create({
		data: {
			permissionId: permission.id,
			roleId: role.id
		}
	})

	await setupSuperAdminDefaultUserWithRolesAndPermissions(role.id)
}

async function setupAdminDefaultRolesAndPermissions() {
	const role = await prisma.Role.create({
		data: { name: 'Admin', guardName: 'web' },
	})

	const permission = await prisma.Permission.create({
		data: { name: 'admin_dashboard_access', guardName: 'web' }
	})

	await prisma.RoleHasPermission.create({
		data: {
			permissionId: permission.id,
			roleId: role.id
		}
	})

	await setupAdminDefaultUserWithRolesAndPermissions(role.id)
}

async function setupSupervisorDefaultRolesAndPermissions() {
	const role = await prisma.Role.create({
		data: { name: 'Supervisor', guardName: 'web' },
	})

	const permission = await prisma.Permission.create({
		data: { name: 'supervisor_dashboard_access', guardName: 'web' }
	})

	await prisma.RoleHasPermission.create({
		data: {
			permissionId: permission.id,
			roleId: role.id
		}
	})

	await setupSupervisorDefaultUserWithRolesAndPermissions(role.id)
}

async function setupAgentDefaultRolesAndPermissions() {
	const role = await prisma.Role.create({
		data: { name: 'Agent', guardName: 'web' },
	})

	const permission = await prisma.Permission.create({
		data: { name: 'agent_dashboard_access', guardName: 'web' }
	})

	await prisma.RoleHasPermission.create({
		data: {
			permissionId: permission.id,
			roleId: role.id
		}
	})

	await setupAgentDefaultUserWithRolesAndPermissions(role.id)
}




seed()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});