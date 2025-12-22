export class User {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    
    constructor(id: number, name: string, email: string, password: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = new Date();
    }
    
}
