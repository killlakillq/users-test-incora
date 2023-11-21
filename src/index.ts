import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { createServer } from 'http';
import { SocketService } from './services/socket.service';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

const app = express();
const server = createServer(app);

const usersController = new UsersController(new UsersService(), new SocketService(server));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', usersController.router);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
