import React from "react";
import MessengerChatIceFeedbackContent from "@/components/Converse/ConverseMessengerApp/MessengerChatIceFeedbackContent";



const MessengerChatMessageItemContent: React.FC<MessengerChatMessageItemContentProps> = ({
     messageType,
     messageContent,
}) => {

    let content: React.ReactNode = null;


    switch (messageType) {
        case "channel_auto_replay":
            content = <>{messageContent}</>;
            break;

        case "iceFeedback":
            content = (
                <div className={`my-4`}>
                    <MessengerChatIceFeedbackContent />
                </div>
            );
            break;
        case "iceFeedbackReplay":
            content = <>{`Ice Replay Received`}</>;
            break;
        case "attachment_image":
            content = <AttachmentMediaContent mediaLink={messageContent} mediaType={`image`} />
            break;
        case "attachment_video":
            content = <AttachmentMediaContent mediaLink={messageContent} mediaType={`video`}/>
            break;
        case "attachment_audio":
            content = <AttachmentMediaContent mediaLink={messageContent} mediaType={`audio`}/>
            break;
        case "text":
            content = <span className={`whitespace-pre-line`}>{messageContent}</span>;
            break;
        default:
            content = <>{messageContent}</>;
    }

    return <article className="text-lg text-gray-600 my-4">{content}</article>;
};

export default MessengerChatMessageItemContent;



const AudioPlayer = ({ src }) => {
    return (
        <div>
            <audio controls>
                <source src={src} type="audio/ogg" />
                <source src={src} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};



function AttachmentMediaContent({ mediaLink, mediaType }: { mediaLink: string, mediaType: string }) {
    const link = mediaLink;

    switch (mediaType) {
        case 'video':
            return (
                <div className={`my-4`}>
                    <video controls className="h-auto max-w-full rounded-lg">
                        <source src={link} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        case 'image':
            return (
                <div className={`my-4`}>
                    <figure className="max-w-lg">
                        <img
                            src={link}
                            className="h-auto max-w-full rounded-lg"
                            alt="Image Attachment"
                        />

                        <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                            Image Attachment
                        </figcaption>
                    </figure>
                </div>
            );

        case 'audio':
            return (
                <div className={`my-4`}>
                    <AudioPlayer src={mediaLink} />
                </div>
            );

        default:
            return (
                <div>
                    <a
                        href={link} target="_blank" rel="noopener noreferrer"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        View Attachment
                    </a>
                </div>
            );
    }
}



interface MessengerChatMessageItemContentProps {
    messageType: string;
    messageContent: any;
}