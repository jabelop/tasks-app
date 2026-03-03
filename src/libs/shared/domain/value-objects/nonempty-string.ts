import EmptyString from 'src/libs/shared/domain/exceptions/empty-string.exception';
import ValueObject from 'src/libs/shared/domain/value-objects/value-object';

export class NonEmptyString implements ValueObject<string> {
  value: string;

  constructor(value: string) {
    if (!value || !value.length) throw new EmptyString();
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
