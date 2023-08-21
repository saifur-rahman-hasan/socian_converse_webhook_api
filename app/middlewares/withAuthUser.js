import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import jwt from "jsonwebtoken";
import {ApiResponse} from "@/lib/ApiResponse";
import UserACLManager from "@/lib/UserACLManager/UserACLManager";

async function getTokenInfo(req, res) {
	const session = await getServerSession(req, res, authOptions)
	const authHeader = req.headers.authorization;

	const authToken = session?.token
		? session.token
		: authHeader && authHeader.split(' ')[1]

	try {
		// Verify and decode the token
		return jwt.verify(authToken, process.env.NEXTAUTH_JWT_SECRET);
	} catch (err) {
		throw new Error('Invalid token');
	}
}

export function withAuthUser(handler) {
	return async (req, res) => {
		try {
			const tokenInfo = await getTokenInfo(req, res);
			req.isAuthenticated = tokenInfo?.id !== undefined && tokenInfo?.name !== undefined
			req.authId = tokenInfo?.id !== undefined && tokenInfo?.id || null
			req.authUser = tokenInfo
			req.authUserId = tokenInfo.user_id

			try {
				const aclManager = new UserACLManager(req.authId)
				const aclAccess = await aclManager.getUserAllRolesAndPermissions()

				req.authUserAclAccess = aclAccess
			}catch (e) {
				req.authUserAclAccess = null
			}

			return handler(req, res);
		} catch (err) {
			ApiResponse.unauthorized(res, err.message)
		}
	};
}
