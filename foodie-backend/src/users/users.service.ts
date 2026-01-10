import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(user: Partial<User>) {
        if (user.password) {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(user.password, salt);
        }
        return this.usersRepository.save(user);
    }

    findByEmail(email: string) {
        return this.usersRepository.findOneBy({ email });
    }

    findAll() {
        return this.usersRepository.find();
    }

    findOne(id: number) {
        return this.usersRepository.findOneBy({ id });
    }

    async update(id: number, updateUserDto: Partial<User>) {
        await this.usersRepository.update(id, updateUserDto);
        return this.findOne(id);
    }

    remove(id: number) {
        return this.usersRepository.delete(id);
    }
}
