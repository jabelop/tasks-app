import { LoginSuccess } from 'src/auth/domain/entities/login-success';
import { User } from 'src/libs/shared/domain/users/entity/user';

export class LoginSuccessDto implements LoginSuccess {
  user: User;
  token: string;
}
