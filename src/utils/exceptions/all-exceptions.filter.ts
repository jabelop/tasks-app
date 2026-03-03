import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { getMetadataStorage, MetadataStorage } from 'class-validator';
import { Response } from 'express';
import { snakeCase } from 'lodash';
import 'reflect-metadata';
import * as util from 'util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Catch 404 static files
    if ('code' in exception && exception.code === 'ENOENT') {
      exception = new NotFoundException();
    }

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let error = HttpStatus[httpStatus] ?? 'Internal Server Error';
    let errors = [];

    if (exception instanceof HttpException) {
      error = exception.getResponse()['error'] ?? HttpStatus[httpStatus];
      errors = exception.getResponse()['errors'] ?? [];
    }

    console.error(util.inspect(exception, { depth: Infinity, colors: true }));

    const responseBody = {
      message: exception.message ?? 'Internal Server Error',
      error: snakeCase(error),
      statusCode: httpStatus,
      errors: this.formatErrorFields(errors),
    };

    response.status(httpStatus).json(responseBody);
  }

  private formatErrorFields(errors: any) {
    return errors.map((error) => {
      const dataType = error.target.constructor;
      const metadataStorage: MetadataStorage = getMetadataStorage();
      const meta = metadataStorage.getTargetValidationMetadatas(
        dataType,
        null,
        false,
        false,
      );

      if (error.children?.length) {
        error = this.parseChildrenErrors(error.property, error.children);
      }

      return {
        field: error.property,
        validValues: meta.length
          ? meta
              .filter((item) => item.propertyName === error.property)
              .map((item) => {
                if (!item.constraints) {
                  return null;
                }

                const validValues = Object.values(item.constraints).reduce(
                  (acc, validValue) => {
                    if (Array.isArray(validValue) && validValue.length > 0) {
                      acc.push(validValue);
                    }

                    if (typeof validValue === 'number') {
                      acc.push(validValue);
                    }

                    return acc;
                  },
                  [],
                );

                return validValues.length > 0
                  ? {
                      [this.parseKey(item.name)]:
                        validValues.length === 1 ? validValues[0] : validValues,
                    }
                  : null;
              })
              .filter((valid) => valid !== null)
          : null,
        errorCodes:
          typeof error.constraints === 'object'
            ? Object.keys(error.constraints).map((key) => {
                return this.getValidationCode(key);
              })
            : error,
        errors:
          typeof error.constraints === 'object'
            ? Object.values(error.constraints)
            : [error],
      };
    });
  }

  private parseChildrenErrors(parentKey: string, errors: any) {
    return errors.reduce((_, error) => {
      if (error.children.length) {
        parentKey = `${parentKey}.${error.property}`;
        return this.parseChildrenErrors(parentKey, error.children);
      }

      error.property = `${parentKey}.${error.property}`;

      return error;
    }, []);
  }

  private parseKey(key: string): string {
    if (key.startsWith('is')) {
      key = key.slice(2);
    }

    return key.charAt(0).toLowerCase() + key.slice(1);
  }

  private getValidationCode(key: string): string {
    return `validations.${this.parseKey(key)}`;
  }
}
