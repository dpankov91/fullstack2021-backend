import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './shared/chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  allMessages: string[] = [];
  constructor(private chatService: ChatService) {}
  @WebSocketServer() server;
  @SubscribeMessage('message')
  handleChatEvent(@MessageBody() message: string): void {
    console.log(message);
    this.allMessages.push(message);
    this.chatService.newMessage(message);
    this.server.emit('newMessage', message);
  }

  @SubscribeMessage('nickname')
  handleNameEvent(
    @MessageBody() nickname: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.chatService.addClient(client.id, nickname);
    this.server.emit('clients', this.chatService.getClients());
  }

  handleConnection(client: any, ...args: any[]): any {
    console.log('Client Connect', client.id);
    client.emit('allMessages', this.chatService.getMessages());
    this.server.emit('clients', this.chatService.getClients());

  }

  handleDisconnect(client: any): any {
    this.chatService.delete(client.id);
    this.server.emit('clients', this.chatService.getClients());
    console.log('Client Disconnect', client.id);
  }
}
