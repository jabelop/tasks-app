import { SetMetadata } from '@nestjs/common';

export const MODULES_KEY = 'modules';
export const ModulesGuard = (modules: string[]) =>
  SetMetadata(MODULES_KEY, modules);
