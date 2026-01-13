import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MenuService } from '../menu/menu.service';
import { MenuItem } from './entities/menu-item.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                return cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
            }
        })
    }))
    create(@Body() createMenuItemDto: any, @UploadedFile() file: Express.Multer.File) {
        const data = {
            ...createMenuItemDto,
            imageUrl: file ? `/uploads/${file.filename}` : createMenuItemDto.imageUrl,
            price: parseFloat(createMenuItemDto.price), // Body values come as strings in multipart
            isAvailable: createMenuItemDto.isAvailable === 'true' || createMenuItemDto.isAvailable === true,
        };
        return this.menuService.create(data);
    }

    @Get()
    findAll(@Query('category') category?: string) {
        if (category && category !== 'All') {
            return this.menuService.findByCategory(category);
        }
        return this.menuService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.menuService.findOne(+id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                return cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
            }
        })
    }))
    update(@Param('id') id: string, @Body() updateMenuItemDto: any, @UploadedFile() file: Express.Multer.File) {
        const data = {
            ...updateMenuItemDto,
        };
        if (file) {
            data.imageUrl = `/uploads/${file.filename}`;
        }
        if (updateMenuItemDto.price) {
            data.price = parseFloat(updateMenuItemDto.price);
        }
        // Convert isAvailable from string to boolean (comes as string from FormData)
        if (updateMenuItemDto.isAvailable !== undefined) {
            data.isAvailable = updateMenuItemDto.isAvailable === 'true' || updateMenuItemDto.isAvailable === true;
        }
        return this.menuService.update(+id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.menuService.remove(+id);
    }
}
