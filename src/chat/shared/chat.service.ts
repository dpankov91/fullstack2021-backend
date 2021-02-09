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

  addClient(id: string, nickname: string) {
    const chatClient: ChatClient = { id: id, nickname: nickname };
    this.clients.push(chatClient);
  }

  delete(id: string) {
    this.clients = this.clients.filter((c) => c.id !== id);
  }

  getMessages(): ChatMessage[] {
    return this.allMessages;
  }
}
