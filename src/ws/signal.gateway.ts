import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from 'src/services/user.service';

export enum Events {
  SIGNAL = 'SIGNAL',
}

@WebSocketGateway({ cors: { origin: '*' } })
export class SignalGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('WS Gateway');
  private users: Record<string, string[]> = {};
  private socketToRoom: Record<string, string> = {};

  constructor(private userSvc: UserService) {
    this.users = {};
    this.socketToRoom = {};
  }

  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
    socket.emit('peer-disconnected', socket.id);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(room);
    socket.to(room).emit('joined-room', { peerId: socket.id });
  }

  @SubscribeMessage('signal')
  handleSignal(
    @MessageBody() data: { peerId: string; signalData: any },
    @ConnectedSocket() socket: Socket,
  ) {
    const { peerId, signalData } = data;
    socket.to(peerId).emit('signal', { peerId: socket.id, data: signalData });
  }
}
