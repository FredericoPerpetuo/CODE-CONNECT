import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('deve criar um usuário e retornar sem passwordHash', async () => {
    const result = await service.create({ name: 'Test', email: 'test@test.com', password: 'senha123' });
    expect(result).toEqual({ id: expect.any(String), name: 'Test', email: 'test@test.com' });
    expect((result as any).passwordHash).toBeUndefined();
  });

  it('deve lançar ConflictException para email duplicado', async () => {
    await service.create({ name: 'Test', email: 'dup@test.com', password: 'senha123' });
    await expect(service.create({ name: 'Test2', email: 'dup@test.com', password: 'senha123' })).rejects.toThrow(
      ConflictException,
    );
  });

  it('deve encontrar usuário por email', async () => {
    await service.create({ name: 'Find', email: 'find@test.com', password: 'senha123' });
    const user = service.findByEmail('find@test.com');
    expect(user).toBeDefined();
    expect(user?.email).toBe('find@test.com');
    expect(user?.passwordHash).toBeDefined();
  });

  it('deve retornar undefined para email inexistente', () => {
    expect(service.findByEmail('nao@existe.com')).toBeUndefined();
  });

  it('deve encontrar usuário por id', async () => {
    const created = await service.create({ name: 'ById', email: 'byid@test.com', password: 'senha123' });
    const user = service.findById(created.id);
    expect(user?.id).toBe(created.id);
  });
});
