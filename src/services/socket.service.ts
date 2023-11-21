import { Server } from 'socket.io';

export class SocketService {
  private io: Server;
  public constructor(server) {
    this.io = new Server(server);
    this.connectSocket();
  }

  public connectSocket() {
    this.io.on('connection', (socket) => {
      console.log('User connected');

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  }

  public emitUserUpdated(userId: number, message: string): void {
    this.io.emit('updated_user', { userId, message });
  }
}
