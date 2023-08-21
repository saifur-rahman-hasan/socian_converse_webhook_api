import ChannelWebhookCreateAction from "@/actions/Integrations/ChannelWebhookCreateAction";
import MessengerToConverseWebhookDataSyncAction from "@/actions/Integrations/MessengerToConverseMessengerWebhookDataSyncAction";
import { ApiResponse } from "@/lib/ApiResponse";
import { throwIf } from "@/lib/ErrorHandler";
import { NextApiRequest, NextApiResponse } from "next";

const VERIFY_TOKEN = process.env.FB_WEBHOOK_SECRET;

interface WebhookGetRequestDataInterface {
	"hub.mode": string;
	"hub.verify_token": string;
	"hub.challenge": string;
}

async function handlePostRequest(
	req: NextApiRequest | any,
	res: NextApiResponse
) {
	try {
		const webhookPayload = req.body;

		try {
			throwIf(
				!webhookPayload?.object || !webhookPayload?.entry?.length,
				new Error("Invalid Webhook Object")
			);

			const webhookDoc = await new ChannelWebhookCreateAction(webhookPayload).execute();

			switch (webhookDoc.payloadType) {
				case "MessengerPayload":
					new MessengerToConverseWebhookDataSyncAction()
						.execute(webhookDoc)
						.then((result) => {
							console.log(
								"MessengerToConverseWebhookDataSyncAction Response: ",
								{ result }
							);
						})
						.catch((error) => {
							console.log(
								`MessengerToConverseWebhookDataSyncAction Response Error: `,
								{ error }
							);
						});

					break;

				case "PageFeedPayload":
					// TODO: Need to implement Fb Page Payload process
					break;

				default:
					console.error("webhookDoc.payloadType is undefined");
			}

			console.log(`\u{1F7EA} FB Messenger Received webhook:`);

			// Returns a '200 OK' response to all requests
			return ApiResponse.success(res, [], "WEBHOOK_DATA_RECEIVED");
		} catch (error) {
			return ApiResponse.unauthorized(res, error.message);
		}
	} catch (e) {
		return ApiResponse.error(res, e);
	}
}

async function handleGetRequest(req, res) {
	const reqData = req.query;

	// parse the query params
	const mode = reqData["hub.mode"];
	const token = reqData["hub.verify_token"];
	const challenge = reqData["hub.challenge"];

	if (mode && token) {
		// checks the mode and token is correct
		if (mode === "subscribe" && token === VERIFY_TOKEN) {
			console.log(`WEBHOOK_VERIFIED`);

			res.status(200).send(challenge);
		} else {
			res.status(403).send();
		}
	}

	res.status(403).send();
}

export default async function MetaWebhook(req, res) {
	switch (req.method) {
		case "GET":
			return await handleGetRequest(req, res);
		case "POST":
			return await handlePostRequest(req, res);
		default:
			return ApiResponse.methodNotAllowed(res, req);
	}
}
