import { ChatClient } from '../models/chat-client.model';
import { ChatMessage } from '../models/chat-message.model';

export const IChatServiceProvider = 'IChatServiceProvider';
export interface IChatService {
  addMessage(message: string, clientId: string): ChatMessage;

  getClients(): ChatClient[];

  addClient(id: string, nickname: string): ChatClient;

  delete(id: string);

  getMessages(): ChatMessage[];

  updateTyping(isTyping: boolean, id: string): ChatClient;
}
