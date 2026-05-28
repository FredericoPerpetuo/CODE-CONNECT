import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  register: jest.fn().mockResolvedValue({ id: '1', name: 'Test', email: 'test@test.com' }),
  login: jest.fn().mockResolvedValue({ access_token: 'token', user: { id: '1', name: 'Test', email: 'test@test.com' } }),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('deve chamar register e retornar user', async () => {
    const result = await controller.register({ name: 'Test', email: 'test@test.com', password: 'senha123' });
    expect(mockAuthService.register).toHaveBeenCalled();
    expect(result).toMatchObject({ email: 'test@test.com' });
  });

  it('deve chamar login e retornar access_token', async () => {
    const result = await controller.login({ email: 'test@test.com', password: 'senha123' });
    expect(mockAuthService.login).toHaveBeenCalled();
    expect(result.access_token).toBe('token');
  });

  it('deve retornar o usuário atual via getMe', () => {
    const user = { id: '1', name: 'Test', email: 'test@test.com' };
    expect(controller.getMe(user)).toBe(user);
  });
});
