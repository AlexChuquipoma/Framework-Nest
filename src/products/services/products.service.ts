import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { PartialUpdateProductDto } from '../dtos/partial-update-product.dto';
import { ProductMapper } from '../mappers/product-mapper';
import { ProductResponseDto } from '../dtos/product-response.dto';

@Injectable() 
export class ProductsService {
  private products: Product[] = []; 
  private idCounter = 1;

  findAll(): ProductResponseDto[] {
    return this.products.map(p => ProductMapper.toResponse(p)); //
  }

  findOne(id: number) {
    const product = this.products.find(p => p.id === id);
    if (!product) return { error: 'Product not found' };
    return ProductMapper.toResponse(product); //
  }

  create(dto: CreateProductDto) {
    const entity = ProductMapper.toEntity(this.idCounter++, dto);
    this.products.push(entity);
    return ProductMapper.toResponse(entity); //
  }

  update(id: number, dto: UpdateProductDto) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return { error: 'Product not found' };

    const updated = { ...this.products[index], ...dto };
    this.products[index] = updated;
    return ProductMapper.toResponse(updated); //
  }

  partialUpdate(id: number, dto: PartialUpdateProductDto) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return { error: 'Product not found' };

    const updated = { ...this.products[index], ...dto };
    this.products[index] = updated;
    return ProductMapper.toResponse(updated); //
  }

  remove(id: number) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return { error: 'Product not found' };

    this.products.splice(index, 1);
    return { message: 'Product deleted successfully' }; //
  }
}