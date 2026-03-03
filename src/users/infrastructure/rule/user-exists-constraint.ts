import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

import { UsersService } from '../../application/users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UserExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}

  async validate(value: string) {
    const user = await this.userService.findOneById(value);
    return !!user;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} does not exists`;
  }
}

export function ValidateUserExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UserExistsConstraint,
    });
  };
}
