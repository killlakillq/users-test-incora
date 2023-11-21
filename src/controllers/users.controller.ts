import { Router, Request, Response } from 'express';
import { UsersService } from '../services/users.service';
import { userSchema, loginUserSchema } from '../common/helpers/joi.helper';
import { Token } from '../common/types';
import { SocketService } from '../services/socket.service';
import { authenticateToken } from '../common/middlewares/jwt.middleware';
import { tryCatch } from '../common/middlewares/try-catch.middleware';

export class UsersController {
  public readonly router: Router;
  public constructor(
    private readonly usersService: UsersService,
    private readonly socketService: SocketService
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post('/', tryCatch(this.createUser.bind(this)));
    this.router.post('/login', tryCatch(this.loginUser.bind(this)));
    this.router.get('/:id', authenticateToken, tryCatch(this.getUserById.bind(this)));
    this.router.put('/:id', authenticateToken, tryCatch(this.updateUser.bind(this)));
  }

  public async createUser(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    const userData = req.body;

    const findUser = await this.usersService.findUserByEmail(userData.email);

    if (findUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const validationBody = await userSchema.validateAsync(userData);

    if (validationBody.error) {
      return res.status(400).json({ message: 'Validation error', error: validationBody.error });
    }

    const user = await this.usersService.createUser(userData);

    if (!user) {
      return res.status(400).json({ message: 'Failed to create user' });
    }

    return res.status(201).json({
      message: 'User created successfully'
    });
  }

  public async loginUser(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | Token> {
    const userData = req.body;

    const validationBody = await loginUserSchema.validateAsync(userData);

    if (validationBody.error) {
      return res.status(400).json({ message: 'Validation error', error: validationBody.error });
    }

    const logged = await this.usersService.loginUser(userData.email, userData.password);

    return res.status(200).json(logged);
  }

  public async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    const user = await this.usersService.getUserById(+id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  }

  public async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const userData = req.body;

    const validationBody = await userSchema.validateAsync(userData);

    if (validationBody.error) {
      return res.status(400).json({ message: 'Validation error', error: validationBody.error });
    }

    const updated = await this.usersService.updateUser(+id, userData);

    if (!updated) {
      return res.status(404).json({ message: 'Failed to update user' });
    }

    this.socketService.emitUserUpdated(+id, 'User updated successfully');

    return res.status(200).json({ message: 'User updated successfully' });
  }
}
