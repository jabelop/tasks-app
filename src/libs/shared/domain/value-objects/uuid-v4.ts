import ValueObject from './value-object';
import BadUuid from '../exceptions/bad-uuid.exception';

export default class UuidV4 implements ValueObject<string> {
  private value: string;

  constructor(value: string) {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
        value,
      )
    )
      throw new BadUuid();
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
