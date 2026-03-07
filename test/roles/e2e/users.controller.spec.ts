import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from 'src/app.module';

describe('RolesController', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'secret' })
      .then((response) => {
        token = response.body.token;
      });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should response 200 on GET /users/', async () => {
    await request(app.getHttpServer())
      .get('/users/')
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  it('should response 404 on GET /users/:id for a non exisiting id', () => {
    return request(app.getHttpServer())
      .get('/users/78146de0-5fbf-40f8-b11c-08975c72036b')
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(404);
      })
      .catch((response) => expect(response.statusCode).toBe(404));
  });
});
