import { hash, verify } from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  hash(text: string): Promise<string> {
    return hash(text);
  }

  verify(text: string, hashedText: string): Promise<boolean> {
    return verify(hashedText, text);
  }
}
