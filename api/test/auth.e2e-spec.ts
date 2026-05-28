import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const user = { name: 'E2E User', email: 'e2e@test.com', password: 'senha1234' };
  let token: string;

  describe('POST /auth/register', () => {
    it('deve criar usuário e retornar 201', async () => {
      const res = await request(app.getHttpServer()).post('/auth/register').send(user).expect(201);
      expect(res.body).toMatchObject({ name: user.name, email: user.email });
      expect(res.body.id).toBeDefined();
      expect(res.body.passwordHash).toBeUndefined();
    });

    it('deve retornar 409 para email duplicado', async () => {
      await request(app.getHttpServer()).post('/auth/register').send(user).expect(409);
    });

    it('deve retornar 400 para email inválido', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...user, email: 'email-invalido' })
        .expect(400);
    });

    it('deve retornar 400 para senha curta', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...user, email: 'outro@test.com', password: '123' })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('deve retornar access_token para credenciais válidas', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(200);
      expect(res.body.access_token).toBeDefined();
      expect(res.body.user.email).toBe(user.email);
      token = res.body.access_token;
    });

    it('deve retornar 401 para senha incorreta', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: 'senhaErrada' })
        .expect(401);
    });

    it('deve retornar 401 para email inexistente', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nao@existe.com', password: 'senha1234' })
        .expect(401);
    });
  });

  describe('GET /auth/me', () => {
    it('deve retornar dados do usuário autenticado', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(res.body).toMatchObject({ email: user.email, name: user.name });
    });

    it('deve retornar 401 sem token', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('deve retornar 401 com token inválido', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer token.invalido.aqui')
        .expect(401);
    });
  });
});
