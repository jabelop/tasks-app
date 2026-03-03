import ValueObject from 'src/libs/shared/domain/value-objects/value-object';
import NotNumericString from '../exceptions/not-numeric-string.exception';

export class NumericString implements ValueObject<string> {
  value: string;

  constructor(value: string) {
    if (!value || !value.length || Number.isNaN(Number(value)))
      throw new NotNumericString();
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
