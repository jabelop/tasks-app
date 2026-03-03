import InvalidDate from '../exceptions/invalid-date.exception';
import ValueObject from './value-object';

export class ValidDateObject implements ValueObject<Date> {
  value: Date;

  constructor(value: Date, field: string = '') {
    const isDateObject: boolean = value instanceof Date && !isNaN(value as any);
    if (!isDateObject) throw new InvalidDate(field);
    this.value = new Date(value);
  }

  getValue(): Date {
    return this.value;
  }
}
