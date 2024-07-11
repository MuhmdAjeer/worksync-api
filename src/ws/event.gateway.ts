// import { Logger } from '@nestjs/common';
// import {
//   WebSocketGateway,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { Socket } from 'socket.io';
// import { UserManager } from './user';

// export interface User {
//   socket: Socket;
//   name: string;
// }

// @WebSocketGateway({ cors: { origin: '*' } })
// export class EventGateway {
//   private readonly logger = new Logger('WS Gateway');
//   // private users: User[];
//   private rooms: string[];
//   private userManager: UserManager;
//   private users: Record<string, string[]> = {};
//   private socketToRoom: Record<string, string> = {};

//   constructor() {
//     this.users = {};
//     this.socketToRoom = {};
//   }

//   @SubscribeMessage('connection')
//   handleEvent(@MessageBody() data: string, @ConnectedSocket() socket: Socket) {
//     socket.on('join room', (roomID) => {
//       this.logger.log('joining room', roomID);
//       if (this.users[roomID]) {
//         this.logger.log('there is users', roomID);
//         this.logger.log('there is roomid', roomID);
//         // @ts-ignore
//         const length = this.users[roomID]?.length;
//         if (length === 4) {
//           socket.emit('room full');
//           return;
//         }
//         // @ts-ignore
//         this.users[roomID].push(socket.id);
//       } else {
//         this.logger.log('no users');
//         // @ts-ignore
//         this.users[roomID] = [socket.id];
//       }
//       this.socketToRoom[socket.id] = roomID;
//       // @ts-ignore
//       const usersInThisRoom = this.users[roomID].filter(
//         (id) => id !== socket.id,
//       );

//       socket.emit('all users', usersInThisRoom);
//     });

//     socket.on('sending signal', (payload) => {
//       socket.to(payload.userToSignal).emit('user joined', {
//         signal: payload.signal,
//         callerID: payload.callerID,
//       });
//     });

//     socket.on('returning signal', (payload) => {
//       socket.to(payload.callerID).emit('receiving returned signal', {
//         signal: payload.signal,
//         id: socket.id,
//       });
//     });

//     socket.on('disconnect', () => {
//       const roomID = this.socketToRoom[socket.id];
//       // @ts-ignore
//       let room = this.users[roomID];
//       if (room) {
//         // @ts-ignore
//         room = room.filter((id) => id !== socket.id);
//         // @ts-ignore
//         this.users[roomID] = room;
//       }
//     });
//   }
// }
