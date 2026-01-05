import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto'; // Usando tu nombre
import { PartialUpdateUserDto } from '../dtos/partial-update-user-dto'; // Usando tu nombre

export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public createdAt: Date,
  ) {}

  // --- 1. FACTORY METHODS (Convertidores estáticos) ---

  // Crea un Usuario desde el DTO de creación
  static fromDto(dto: CreateUserDto): User {
    return new User(
      0, // ID temporal
      dto.name,
      dto.email,
      dto.password,
      new Date(),
    );
  }

  // Convierte lo que viene de la Base de Datos a este Modelo
  static fromEntity(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      entity.createdAt,
    );
  }

  // --- 2. MÉTODOS DE INSTANCIA (Transformaciones) ---

  // Convierte este modelo a una Entidad de Base de Datos
  toEntity(): UserEntity {
    const entity = new UserEntity();
    if (this.id > 0) {
      entity.id = this.id;
    }
    entity.name = this.name;
    entity.email = this.email;
    entity.password = this.password;
    return entity;
  }

  // Prepara la respuesta JSON (oculta el password)
  toResponseDto() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }

  // Actualizar datos (PUT)
  update(dto: UpdateUserDto): User {
    this.name = dto.name;
    this.email = dto.email;
    if (dto.password) {
      this.password = dto.password;
    }
    return this;
  }

  // Actualizar parcial (PATCH)
  partialUpdate(dto: PartialUpdateUserDto): User {
    if (dto.name !== undefined) this.name = dto.name;
    if (dto.email !== undefined) this.email = dto.email;
    if (dto.password !== undefined) this.password = dto.password;
    return this;
  }
}