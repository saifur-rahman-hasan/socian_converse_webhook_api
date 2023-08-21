import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import jwt from "jsonwebtoken";
import SocianAuthClient from "@socian/socian-auth-client";
import SOCIAN_AUTH_CLIENT_CONFIG from "@/SocianAuthSDK/SocianAuthClientConfig";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions = {
	// Enable debug messages in the console if you are having problems
	debug: process.env.NODE_ENV !== "production",
	secret: process.env.NEXTAUTH_JWT_SECRET,

	pages: {
		signIn: '/auth/signIn',
	},

	adapter: PrismaAdapter(prisma),

	providers: [
		CredentialsProvider({
			id: 'socian_auth_provider',
			name: 'socian_auth_provider',
			credentials: {
				intent_id: { label: 'intent_id', type: 'password' },
				token: { label: 'token', type: 'password' },
			},
			async authorize(credentials, req) {
				const payload = {
					intent_id: credentials.intent_id,
					token: credentials.token,
				};

				const authClient = new SocianAuthClient(SOCIAN_AUTH_CLIENT_CONFIG)

				// Verify the intent id
				const intentVerified = await authClient.verifyIntentId(payload.intent_id)
				if( ! intentVerified ) return  null

				// Get the user information using token
				const tokenUser = await authClient.getUserByToken(payload.token)

				// Return null if user data could not be retrieved
				if ( !tokenUser?.socian_id ) return null

				// Check if the user already exists in the database
				const existingUser = await prisma.user.findUnique({
					where: { email: tokenUser.email },
					include: { accounts: true }, // Include the accounts relation
				});

				if (existingUser) {

					// User already exists, update the user's information
					const updatedUser = await prisma.user.update({
						where: { id: existingUser.id },
						data: { name: tokenUser.name, image: tokenUser.image },
					});

					return {
						...updatedUser,
						...tokenUser,
					};
				} else {
					// User does not exist, create a new account and associate it with the user
					const newUser = await prisma.user.create({
						data: {
							email: tokenUser.email,
							name: tokenUser.name,
							image: tokenUser.image,
							accounts: { // Create the user's account
								create: {
									type: 'provider', // Set the account type
									provider: 'socian_auth_provider', // Set the account provider
									providerAccountId: tokenUser.socian_id.toString(), // Set the provider account id
								},
							},
						},
						include: { accounts: true }, // Include the accounts relation
					});

					return {
						...newUser,
						...tokenUser
					};
				}
			},
		}),
	],

	callbacks: {
		// called after successful signing
		jwt: async ({ token, user, account, profile, isNewUser}) => {
			const isUserSignedIn = !!user;

			if(isUserSignedIn) {
				token.id = user.socian_id.toString();

				// Add the isNewUser flag to the token
				token.isNewUser = isNewUser;
				token.user_id = user.id
			}

			return Promise.resolve(token);
		}, // called whenever session is checked
		session: async ({ session, token }) => {
			const encodedToken = jwt.sign(token, process.env.NEXTAUTH_JWT_SECRET, { algorithm: 'HS256'});
			session.id = token.id;
			session.token = encodedToken;

			// Include the isNewUser flag in the session
			session.isNewUser = token.isNewUser;
			session.user.id = token.user_id

			return Promise.resolve(session);
		}
	},

	session: {
		strategy: 'jwt',
		maxAge: (24 * 60 * 60) * 30, // 30d
	},

	jwt: {
		secret: process.env.NEXTAUTH_JWT_SECRET,
		encryption: true,
	},
}

//Api route function that is returned from next auth
export default NextAuth(authOptions)