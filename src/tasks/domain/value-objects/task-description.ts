import ValueObject from 'src/libs/shared/domain/value-objects/value-object';
import InvalidTaskDescription from '../exceptions/invalid-task-description.exception';

export class TaskDescription implements ValueObject<string> {
  value: string;

  constructor(value: string) {
    if (value.length > 500) throw new InvalidTaskDescription();
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
