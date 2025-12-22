import { Injectable } from '@nestjs/common';
import { UserMapper } from '../mappers/user-mapper';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { lUpdateUserDto } from '../dtos/update-user.dto';
import { PartialUpdateUserDto } from '../dtos/partial-update-user-dto';

@Injectable() 
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  findAll() {
    return this.users.map(user => UserMapper.toResponse(user));
  }

  findOne(id: number) {
    const user = this.users.find(u => u.id === id);
    if (!user) return { error: 'User not found' };
    return UserMapper.toResponse(user);
  }

  create(dto: CreateUserDto) {
    const entity = UserMapper.toEntity(this.idCounter++, dto);
    this.users.push(entity);
    return UserMapper.toResponse(entity);
  }

  update(id: number, dto: lUpdateUserDto) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return { error: 'User not found' };

    const originalUser = this.users[index];
    const updatedUser = { ...originalUser, ...dto };
    this.users[index] = updatedUser;
    
    return UserMapper.toResponse(updatedUser);
  }

  partialUpdate(id: number, dto: PartialUpdateUserDto) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return { error: 'User not found' };

    const user = this.users[index];
    const updatedUser = { ...user, ...dto };
    this.users[index] = updatedUser;
    
    return UserMapper.toResponse(updatedUser);
  }

  remove(id: number) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return { error: 'User not found' };

    this.users.splice(index, 1);
    return { message: 'Deleted successfully' };
  }
}