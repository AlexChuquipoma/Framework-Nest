import { CreateProductDto } from "../dtos/create-product.dto";
import { Product } from "../entities/product.entity";
import { ProductResponseDto } from "../dtos/product-response.dto";

export class ProductMapper {
    static toEntity(id: number, dto: CreateProductDto): Product {
        return new Product(id, dto.name, dto.price, dto.description);
    }

    // Ahora especificamos que devuelve un ProductResponseDto
    static toResponse(product: Product): ProductResponseDto {
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description
        };
    }
}