type Message = {
    type: string;
    content: string;
    iceContent: any;
  };
  
  type Participant = {
    id: number;
    name: string;
    role: string;
    image: string | null;
  };
  
  type MessageData = {
      messageType: string,
      content: any,
      from: Participant;
      to: Participant;
      message: Message,
      iceFeedback: boolean,
      sourceMessageId: string | number,
      sourceData: null;
      conversationId: string;
      threadId: number;
      created_at: Date;
      updated_at: Date;
  };
  
  export default function createMessageData(
    conversationId: string,
    threadId: number,
    fromParticipant: Participant,
    toParticipant: Participant,
    message: Message,
    sourceData: any,
    iceFeedback: boolean,
    messageType: string,
    messageContent: any
  ): MessageData {
      const now = new Date();
      return {
          messageType: messageType,
          content: messageContent,
          from: {...fromParticipant},
          to: {...toParticipant},
          message: message,
          iceFeedback: iceFeedback,
          sourceMessageId: sourceData?.id || '',
          sourceData: sourceData || null,
          conversationId: conversationId,
          threadId: threadId,
          created_at: now,
          updated_at: now,
      };
  }
  
