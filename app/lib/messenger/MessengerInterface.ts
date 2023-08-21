export interface MessengerIceFeedbackPostDataInterface {
    recipient: { id: string },
    messaging_type: string,
    message: {
        text: string,
        quick_replies: any
    }
}