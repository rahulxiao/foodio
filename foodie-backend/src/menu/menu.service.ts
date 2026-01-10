import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './entities/menu-item.entity';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(MenuItem)
        private menuRepository: Repository<MenuItem>,
    ) { }

    create(menuItem: Partial<MenuItem>) {
        return this.menuRepository.save(menuItem);
    }

    findAll() {
        return this.menuRepository.find();
    }

    findByCategory(category: string) {
        return this.menuRepository.find({ where: { category } });
    }

    findOne(id: number) {
        return this.menuRepository.findOneBy({ id });
    }

    async update(id: number, updateMenuItemDto: Partial<MenuItem>) {
        await this.menuRepository.update(id, updateMenuItemDto);
        return this.findOne(id);
    }

    remove(id: number) {
        return this.menuRepository.delete(id);
    }
}
