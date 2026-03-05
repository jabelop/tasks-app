import ValueObject from 'src/libs/shared/domain/value-objects/value-object';
import InvalidUserName from '../../exceptions/users/invalid-username.exception';

export class UserName implements ValueObject<string> {
  value: string;

  constructor(value: string) {
    if (value.length < 4 || value.length > 50) throw new InvalidUserName();
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
