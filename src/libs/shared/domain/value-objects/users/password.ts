import ValueObject from 'src/libs/shared/domain/value-objects/value-object';
import InvalidPassword from '../../exceptions/users/invalid-password.exception';

export class Password implements ValueObject<string> {
  value: string;

  constructor(value: string) {
    if (value.length < 8 || value.length > 256) throw new InvalidPassword();
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
