import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from 'src/libs/shared/domain/users/entity/user';
import { UsersRepository } from 'src/users/domain/repository/users.repository';

@Injectable()
export class UsersTestRepository implements UsersRepository {
    users: User[] = [
        { 
            id: '78146de0-5fbf-40f8-b11c-08975c72036e', 
            name: "Test1",
            email: "test1@tasks.com",
            roleId: randomUUID(),
            role: {
                id: randomUUID(),
                permissions: '',
                name: 'Admin',
                status: true,
            },
            status: true,
            username: "test1",
            password:  "test1Password"
        }, 
        {
            id: '78146de0-5fbf-40f8-b11c-08975c72036b',
            name: "Test2",
            email: "test2@tasks.com",
            roleId: randomUUID(),
            status: true,
            role: {
                id: randomUUID(),
                permissions: '',
                name: 'User',
                status: true,
            },
            username: "test2",
            password: "test2Password"
        }
    ]
    constructor() { }
    
    async findAll(): Promise<User[]> {
        return this.users;
    }

    async findOneById(id: string): Promise<User | null> {
        return this.users.find(user => user.id === id);
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.users.find(user => user.username === username);
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.users.find(user => user.email === email);
    }
    
    async create(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }

    async update(user: User): Promise<User> {
        const indexToUpdate = this.users.findIndex(usr => usr.id === user.id);
        if (indexToUpdate < 0) return null;
        this.users.splice(indexToUpdate, 1, user);
        return user;
        
    }

    async delete(user: User): Promise<boolean> {
        const indexToUpdate = this.users.findIndex(usr => usr.id === user.id);
        if (indexToUpdate < 0) return false;
        this.users.splice(indexToUpdate, 1);
        return true;
    }

}