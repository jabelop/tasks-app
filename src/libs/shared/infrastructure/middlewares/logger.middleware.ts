import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const data = req.body && Object.keys(req.body).length ? req.body : (req.params || {}); 
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${JSON.stringify(data)}`);
    next();
  }
}