import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        { provide: JwtService, useValue: { signAsync: jest.fn().mockResolvedValue('mock.token') } },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('deve registrar um usuário e retornar sem passwordHash', async () => {
    const result = await authService.register({ name: 'Test', email: 'test@test.com', password: 'senha123' });
    expect(result).toMatchObject({ name: 'Test', email: 'test@test.com' });
    expect((result as any).passwordHash).toBeUndefined();
  });

  it('deve efetuar login e retornar access_token', async () => {
    await usersService.create({ name: 'Login', email: 'login@test.com', password: 'senha123' });
    const result = await authService.login({ email: 'login@test.com', password: 'senha123' });
    expect(result.access_token).toBe('mock.token');
    expect(result.user.email).toBe('login@test.com');
  });

  it('deve lançar UnauthorizedException para email inexistente', async () => {
    await expect(authService.login({ email: 'nao@existe.com', password: 'senha123' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('deve lançar UnauthorizedException para senha incorreta', async () => {
    await usersService.create({ name: 'Wrong', email: 'wrong@test.com', password: 'senha123' });
    await expect(authService.login({ email: 'wrong@test.com', password: 'senhaErrada' })).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
