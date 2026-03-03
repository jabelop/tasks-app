import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

const validation = (value: any, args?: ValidationArguments) => {
  const [relatedPropertyName] = args.constraints;
  const relatedValue = (args.object as any)[relatedPropertyName];

  return !relatedValue || value !== undefined;
};

@ValidatorConstraint({ name: 'requireIfConstraint', async: false })
class RequireIfConstraint implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments) {
    return validation(value, args);
  }

  defaultMessage?(args?: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} is required since ${relatedPropertyName} is present.`;
  }
}

export function RequireIf(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: RequireIfConstraint,
    });
  };
}
