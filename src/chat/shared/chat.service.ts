import { Injectable } from '@nestjs/common';
import { ChatClient } from './chat-client.model';
import { ChatMessage } from './chat-message.model';

@Injectable()
export class ChatService {
  allMessages: ChatMessage[] = [];
  clients: ChatClient[] = [];

  addMessage(message: string, clientId: string): ChatMessage {
    const client = this.clients.find((c) => c.id == clientId);
    const chatMessage: ChatMessage = { message: message, sender: client };
    this.allMessages.push(chatMessage);
    return chatMessage;
  }

  getClients(): ChatClient[] {
    return this.clients;
  }

  addClient(id: string, nickname: string): ChatClient {
    let chatClient = this.clients.find(
      (c) => c.nickname === nickname && c.id === id,
    );
    if (chatClient) {
      return chatClient;
    }
    if (this.clients.find((c) => c.nickname === nickname)) {
      throw new Error('Nickname already used');
    }
    chatClient = { id: id, nickname: nickname };
    this.clients.push(chatClient);
    return chatClient;
  }

  delete(id: string) {
    this.clients = this.clients.filter((c) => c.id !== id);
  }

  getMessages(): ChatMessage[] {
    return this.allMessages;
  }

  updateTyping(isTyping: boolean, id: string): ChatClient {
    const chatClient = this.clients.find((c) => c.id === id);
    if (chatClient && chatClient.isTyping !== isTyping) {
      chatClient.isTyping = isTyping;
      return chatClient;
    }
    return undefined;
  }
}
