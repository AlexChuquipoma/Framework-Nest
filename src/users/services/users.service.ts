import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../entities/user.entity';
import { User } from '../models/user.model';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

import { PartialUpdateUserDto } from '../dtos/partial-update-user-dto';
import { UserResponse } from '../dtos/user-response.dto';

import { NotFoundException } from '../../exceptions/domain/not-found.exception';
import { ConflictException } from '../../exceptions/domain/conflict.exception';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserResponse[]> {
    const entities = await this.userRepo.find();
    return entities.map(e => User.fromEntity(e).toResponseDto());
  }

  async findOne(id: number): Promise<UserResponse> {
    const entity = await this.userRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Usuario no encontrado con ID: ${id}`);
    }
    return User.fromEntity(entity).toResponseDto();
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException(`El email ${dto.email} ya está registrado`);
    }

    const saved = await this.userRepo.save(
      User.fromDto(dto).toEntity(),
    );

    return User.fromEntity(saved).toResponseDto();
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserResponse> {
    const entity = await this.userRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Usuario no encontrado con ID: ${id}`);

    const saved = await this.userRepo.save(
      User.fromEntity(entity).update(dto).toEntity(),
    );

    return User.fromEntity(saved).toResponseDto();
  }

  async partialUpdate(id: number, dto: PartialUpdateUserDto): Promise<UserResponse> {
    const entity = await this.userRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Usuario no encontrado con ID: ${id}`);

    const saved = await this.userRepo.save(
      User.fromEntity(entity).partialUpdate(dto).toEntity(),
    );

    return User.fromEntity(saved).toResponseDto();
  }

  async remove(id: number): Promise<void> {
    const entity = await this.userRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Usuario no encontrado con ID: ${id}`);
    await this.userRepo.remove(entity);
  }
}
