import ValueObject from 'src/libs/shared/domain/value-objects/value-object';
import InvalidTaskTitle from '../exceptions/invalid-task-title.exception';

export class TaskTitle implements ValueObject<string> {
  value: string;

  constructor(value: string) {
    if (value.length < 4 || value.length > 100) throw new InvalidTaskTitle();
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
