import { User } from 'src/libs/shared/domain/users/entity/user';

export interface LoginSuccess {
  user: User;
  token: string;
}
