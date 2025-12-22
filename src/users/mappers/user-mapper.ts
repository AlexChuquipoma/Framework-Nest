import {User} from '../entities/user.entity';

export class UserMapper {
    static toEntity(id: number, dto: any): User {
        return new User(id, dto.name, dto.email, dto.password);
    }

    static toResponse(entity: User) {
        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
        };
    }
}