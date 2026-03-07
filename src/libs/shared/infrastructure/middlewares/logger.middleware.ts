import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const logger = new Logger();
    const data =
      req.body && Object.keys(req.body).length ? req.body : req.params || {};
    const start = performance.now();
    res.on('finish', () => {
      const end = performance.now();
      const time = new Date().toISOString();
      const payload = JSON.stringify(data);
      const { id, role } = (<any>req).user || { id: '', role: { name: '' } };
      const roleName = role?.name || '';
      //const userId = (Object.keys(req));
      logger.log(
        `[${time}] ${req.method} ${req.url} execution time: ${(end - start).toFixed(2)} ms, payload: ${payload} userId: ${id} role: ${roleName}`,
      );
    });
    next();
  }
}
