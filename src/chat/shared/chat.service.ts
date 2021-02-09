import { Injectable } from '@nestjs/common';
import { ChatClient } from './chat-client.model';

@Injectable()
export class ChatService {
  allMessages: string[] = [];
  clients: ChatClient[] = [];

  newMessage(message: string): void {
    this.allMessages.push(message);
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

  getMessages(): string[] {
    return this.allMessages;
  }
}
