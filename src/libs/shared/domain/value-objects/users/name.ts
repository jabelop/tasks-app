import ValueObject from 'src/libs/shared/domain/value-objects/value-object';
import InvalidName from '../../exceptions/users/invalid-name.exception';

export class Name implements ValueObject<string> {
  value: string;

  constructor(value: string) {
    if (value.length < 4 || value.length > 50) throw new InvalidName();
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
