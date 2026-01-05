import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { Product } from '../models/product.model';

import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { PartialUpdateProductDto } from '../dtos/partial-update-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';

import { NotFoundException } from '../../exceptions/domain/not-found.exception';
import { ConflictException } from '../../exceptions/domain/conflict.exception';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductResponseDto[]> {
    const entities = await this.productRepo.find();
    return entities.map((e) => Product.fromEntity(e).toResponseDto());
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const entity = await this.productRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Producto no encontrado con ID: ${id}`);
    return Product.fromEntity(entity).toResponseDto();
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    // VALIDACIÓN: Nombre único
    const exists = await this.productRepo.findOne({ where: { name: dto.name } });
    if (exists) {
      throw new ConflictException(`Ya existe un producto con el nombre: ${dto.name}`);
    }

    const model = Product.fromDto(dto);
    const entity = model.toEntity();
    const saved = await this.productRepo.save(entity);
    return Product.fromEntity(saved).toResponseDto();
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const entity = await this.productRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Producto no encontrado con ID: ${id}`);

    let model = Product.fromEntity(entity);
    model = model.update(dto);
    
    const saved = await this.productRepo.save(model.toEntity());
    return Product.fromEntity(saved).toResponseDto();
  }

  async partialUpdate(id: number, dto: PartialUpdateProductDto): Promise<ProductResponseDto> {
    const entity = await this.productRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Producto no encontrado con ID: ${id}`);

    let model = Product.fromEntity(entity);
    model = model.partialUpdate(dto);

    const saved = await this.productRepo.save(model.toEntity());
    return Product.fromEntity(saved).toResponseDto();
  }

  async remove(id: number): Promise<void> {
    const entity = await this.productRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Producto no encontrado con ID: ${id}`);
    await this.productRepo.remove(entity);
  }
}