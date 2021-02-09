import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './shared/chat.service';
import { WelcomeDto } from './shared/welcome.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  allMessages: string[] = [];
  constructor(private chatService: ChatService) {}

  @WebSocketServer() server;
  @SubscribeMessage('message')
  handleChatEvent(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(message);
    this.allMessages.push(message);
    const chatMessage = this.chatService.addMessage(message, client.id);
    this.server.emit('newMessage', chatMessage);
  }

  @SubscribeMessage('nickname')
  handleNameEvent(
    @MessageBody() nickname: string,
    @ConnectedSocket() client: Socket,
  ): void {
    const chatClient = this.chatService.addClient(client.id, nickname);
    const welcome: WelcomeDto = {
      clients: this.chatService.clients,
      messages: this.chatService.getMessages(),
      client: chatClient,
    };
    client.emit('welcome', welcome);
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
