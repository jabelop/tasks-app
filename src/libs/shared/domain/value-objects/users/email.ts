import ValueObject from 'src/libs/shared/domain/value-objects/value-object';
import InvalidEmail from '../../exceptions/users/invalid-email.exception';

export class Email implements ValueObject<string> {
  value: string;

  constructor(value: string) {
    if (
      !/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(
        value,
      ) ||
      value.length > 300
    )
      throw new InvalidEmail();

    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
