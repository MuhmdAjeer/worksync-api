import { Logger, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserManager } from './user';
import { UserRepo } from 'src/entities/User.entity';
import { WsAuthGuard } from 'src/guards/ws-auth.guard';
import { UserService } from 'src/services/user.service';

export interface User {
  socket: Socket;
  name: string;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class EventGateway {
  private readonly logger = new Logger('WS Gateway');
  private users: Record<string, string[]> = {};
  private socketToRoom: Record<string, string> = {};

  constructor(private userSvc: UserService) {
    this.users = {};
    this.socketToRoom = {};
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('connection')
  async handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.on('join room', async ({ projectId }: { projectId: string }) => {
      this.logger.log('joining project room', projectId);

      const roomID = projectId;
      //   check if already on the project started a call
      if (this.users[projectId]) {
        this.logger.log('there is users', projectId);
        this.logger.log('there is roomid', this.users[projectId]);
        try {
          // @ts-ignore
          const userId = socket['user'].id;

          // Check if the user is part of the project
          const isUserPartOfProject = await this.userSvc.isUserPartOfProject(
            userId,
            projectId,
          );
          if (!isUserPartOfProject) return;
        } catch (error) {
          socket.emit('error', 'error occured');
        }

        // @ts-ignore
        this.users[roomID].push(socket.id);
      } else {
        this.logger.log('no users');
        // @ts-ignore
        this.users[roomID] = [socket.id];
      }
      this.socketToRoom[socket.id] = roomID;
      // @ts-ignore
      const usersInThisRoom = this.users[roomID].filter(
        (id) => id !== socket.id,
      );

      socket.emit('all users', usersInThisRoom);
    });

    socket.on('sending signal', (payload) => {
      socket.to(payload.userToSignal).emit('user joined', {
        signal: payload.signal,
        callerID: payload.callerID,
      });
    });

    socket.on('returning signal', (payload) => {
      socket.to(payload.callerID).emit('receiving returned signal', {
        signal: payload.signal,
        id: socket.id,
      });
    });

    socket.on('room:leave', () => {
      this.logger.log('leaved room');
      const roomID = this.socketToRoom[socket.id];
      // @ts-ignore
      let room = this.users[roomID];
      if (room) {
        // @ts-ignore
        room = room.filter((id) => id !== socket.id);
        // @ts-ignore
        this.users[roomID] = room;
      }
      this.logger.log({ roomID, room }, 'leave:room');
      socket.emit('user:leave', socket.id);
    });

    socket.on('disconnect', () => {
      const roomID = this.socketToRoom[socket.id];
      // @ts-ignore
      let room = this.users[roomID];
      if (room) {
        // @ts-ignore
        room = room.filter((id) => id !== socket.id);
        // @ts-ignore
        this.users[roomID] = room;
      }
      socket.emit('user:leave', socket.id);
    });
  }
}

@WebSocketGateway({ cors: { origin: '*' } })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('WS Gateway');
  private users: Record<string, string[]> = {};
  private socketToRoom: Record<string, string> = {};

  constructor(private userSvc: UserService) {
    this.users = {};
    this.socketToRoom = {};
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('Connected to socket', client, args);
  }

  handleDisconnect(socket: Socket) {
    const roomID = this.socketToRoom[socket.id];
    // @ts-ignore
    let room = this.users[roomID];
    if (room) {
      // @ts-ignore
      room = room.filter((id) => id !== socket.id);
      // @ts-ignore
      this.users[roomID] = room;
    }
    socket.emit('user:leave', socket.id);
  }

  @UseGuards()
  @SubscribeMessage('join room')
  async handleJoinRoom(
    @MessageBody() { projectId }: { projectId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log('joining project room', projectId);
    const roomID = projectId;
    //   check if already on the project started a call
    if (this.users[projectId]) {
      this.logger.log('there is users', projectId);
      this.logger.log('there is roomid', this.users[projectId]);
      try {
        // @ts-ignore
        const userId = socket['user'].id;

        // Check if the user is part of the project
        const isUserPartOfProject = await this.userSvc.isUserPartOfProject(
          userId,
          projectId,
        );
        if (!isUserPartOfProject) return;
      } catch (error) {
        socket.emit('error', 'error occured');
      }

      // @ts-ignore
      this.users[roomID].push(socket.id);
    } else {
      this.logger.log('no users');
      // @ts-ignore
      this.users[roomID] = [socket.id];
    }
    this.socketToRoom[socket.id] = roomID;
    // @ts-ignore
    const usersInThisRoom = this.users[roomID].filter((id) => id !== socket.id);

    socket.emit('all users', usersInThisRoom);
  }

  @UseGuards()
  @SubscribeMessage('sending signal')
  async handleSendingSignal(
    @MessageBody() payload: any,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(payload.userToSignal).emit('user joined', {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  }

  @UseGuards()
  @SubscribeMessage('returning signal')
  async handleReturningSignal(
    @MessageBody() payload: any,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(payload.callerID).emit('receiving returned signal', {
      signal: payload.signal,
      id: socket.id,
    });
  }

  @UseGuards()
  @SubscribeMessage('room:leave')
  handleRoomLeave(@ConnectedSocket() socket: Socket) {
    const roomID = this.socketToRoom[socket.id];
    this.logger.log('im leaving', socket.id);
    if (roomID && this.users[roomID]) {
      // @ts-ignore
      const index = this.users[roomID].indexOf(socket.id);
      if (index !== -1) {
        // @ts-ignore
        this.users[roomID].splice(index, 1);
        socket.broadcast.emit('user:leave', socket.id);
      }
    }
  }
}
