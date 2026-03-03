import NegativeNumeric from 'src/libs/shared/domain/exceptions/negative-numeric.exception';
import ValueObject from 'src/libs/shared/domain/value-objects/value-object';

export class PositiveNumber implements ValueObject<number> {
  value: number;

  constructor(value: number) {
    if (value < 0) throw new NegativeNumeric();
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }
}
