import ValueObject from 'src/libs/shared/domain/value-objects/value-object';
import InvalidTaskStatus from '../exceptions/invalid-task-status.exception';

const validStatus = {
  'completed': true,
  'not completed': true
}

export class TaskStatus implements ValueObject<string> {
  value: string;

  constructor(value: string) {
    if (!validStatus[value]) throw new InvalidTaskStatus();
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
