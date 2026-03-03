import { Login } from 'src/auth/domain/entities/login';

export class LoginDTO implements Login {
  username: string;
  password: string;
}
