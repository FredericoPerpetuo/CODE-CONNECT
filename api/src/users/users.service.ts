import { ConflictException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  private readonly users = new Map<string, User>();

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const existing = this.findByEmailInternal(dto.email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user: User = { id: uuidv4(), name: dto.name, email: dto.email, passwordHash };
    this.users.set(user.id, user);
    return this.toResponse(user);
  }

  findByEmail(email: string): User | undefined {
    return this.findByEmailInternal(email);
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  toResponse(user: User): UserResponseDto {
    return { id: user.id, name: user.name, email: user.email };
  }

  private findByEmailInternal(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }
}
