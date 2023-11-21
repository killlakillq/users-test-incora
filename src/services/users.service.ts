import { UpdateResult } from 'typeorm';
import { JWT_SECRET } from '../common/constants';
import { myDataSource } from '../common/databases/typeorm';
import { UsersEntity } from '../common/entities/users.entity';
import { Token, Users } from '../common/types';
import { compare, hash } from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const usersRepository = myDataSource.getRepository(UsersEntity);

export class UsersService {
  public async createUser(userData: Users): Promise<Users> {
    const encryptedPassword = await hash(userData.password, 10);

    if (!encryptedPassword) {
      throw new Error('Failed to encrypt password');
    }

    return await usersRepository.save({
      ...userData,
      password: encryptedPassword
    });
  }

  public async loginUser(email: string, password: string): Promise<Token> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const verifyPassword = await compare(user.password, password);

    if (verifyPassword) {
      throw new Error('Invalid password');
    }
    const token = jwt.sign({ user_id: user.id, email }, JWT_SECRET, {
      expiresIn: '2h'
    });

    return {
      access_token: token
    };
  }

  public async updateUser(id: number, userData: Users): Promise<UpdateResult> {
    return await usersRepository.update({ id }, { ...userData });
  }

  public async getUserById(id: number): Promise<Users> {
    return await usersRepository.findOneBy({ id });
  }

  public async findUserByEmail(email: string): Promise<UsersEntity> {
    return await usersRepository.findOneBy({ email });
  }
}
