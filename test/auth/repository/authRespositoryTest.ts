import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LoginSuccessDto } from 'src/auth/application/dto/login-success.dto';
import { AuthRepository } from 'src/auth/domain/repository/auth.repository';
import { UserDTO } from 'src/libs/shared/application/users/dto/user.dto';

@Injectable()
export class AuthRepositoryTest implements AuthRepository {
  users: UserDTO[] = [
    {
      id: '78146de0-5fbf-40f8-b11c-08975c72036e',
      name: 'Test1',
      email: 'test1@tasks.com',
      roleId: randomUUID(),
      role: {
        id: randomUUID(),
        permissions: '',
        name: 'Admin',
        status: true,
      },
      status: true,
      subscriptionId: '06c2f397-def1-3336-a0a9-476b482b80eb',
      username: 'test1',
      password: 'test1Password',
    },
    {
      id: '78146de0-5fbf-40f8-b11c-08975c72036b',
      name: 'Test2',
      email: 'test2@tasks.com',
      roleId: randomUUID(),
      status: true,
      subscriptionId: '06c2f397-def1-3336-a0a9-476b482b80eb',
      role: {
        id: randomUUID(),
        permissions: '',
        name: 'User',
        status: true,
      },
      username: 'test2',
      password: 'test2Password',
    },
  ];
  constructor() {}

  async login(username: string, password: string): Promise<LoginSuccessDto> {
    const user = this.users.find(
      (usr) => usr.username === username && usr.password === password,
    );
    if (!user) throw new UnauthorizedException();
    return {
      user,
      token: 'TestToken',
    };
  }

  async signup(user: UserDTO): Promise<UserDTO> {
    this.users.push(user);
    return user;
  }

  async refreshToken(user: UserDTO): Promise<LoginSuccessDto> {
    if (!this.users.find((usr) => usr.id === user.id))
      throw new UnauthorizedException();
    return {
      user,
      token: 'Refreshed token',
    };
  }
}
