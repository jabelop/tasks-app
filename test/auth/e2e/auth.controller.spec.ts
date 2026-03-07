import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('AuthController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should response 200 on POST /auth/login good data', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'secret' })
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  it('should response 401 on POST /auth/login not existing data', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'test11', password: 'test11Password' })
      .then((response) => {
        expect(response.statusCode).toBe(401);
      })
      .catch((response) => expect(response.statusCode).toBe(401));
  });
});
