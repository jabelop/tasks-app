import InvalidDate from '../exceptions/invalid-date.exception';
import ValueObject from './value-object';

export class ValidDate implements ValueObject<string> {
  value: string;

  constructor(value: string, field: string = '') {
    if (isNaN(Date.parse(value))) throw new InvalidDate(field);
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
