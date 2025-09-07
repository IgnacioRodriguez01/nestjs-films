import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import { User } from './schema/user.schema';
import { FilterQuery } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    findAll(): Promise<User[]> {
        return this.usersRepository.findAll({});
    }

    findOneOrFail(filter: FilterQuery<User>): Promise<User> {
        return this.usersRepository.findOneOrFail(filter);
    }

    findOneWithoutFail(filter: FilterQuery<User>): Promise<User | null> {
        return this.usersRepository.findOneWithoutFail(filter);
    }

    create(user: User): Promise<User> {
        return this.usersRepository.create(user);
    }
}
