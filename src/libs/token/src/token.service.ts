import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generate(payload: object): string {
    return this.jwtService.sign(payload);
  }

  verify(token: string): any {
    return this.jwtService.verify(token);
  }

  /**
   * decode the token
   *
   * @param {string} token the token to decode
   *
   * @returns {string} the decoded token
   */
  decode<T = any>(token: string, options?: any): T {
    return this.jwtService.decode(token, options);
  }

  /**
   * sign the data fo generating the token
   *
   * @param {any} token the payload data
   *
   * @param {any} options optinal additional options to sign
   *
   * @returns {string} the generated token
   */
  sign(payload: any, options?: any): string {
    return this.jwtService.sign(payload, options);
  }
}
