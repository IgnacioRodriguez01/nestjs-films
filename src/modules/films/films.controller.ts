import { Controller, Get, Param, Post, Body, Delete, Patch } from '@nestjs/common';
import { FilmsService } from './films.service';
import { Types } from 'mongoose';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CreateFilmDto, UpdateFilmDto } from './dto/films.dto';
import { plainToInstance } from 'class-transformer';
import { Film } from './schema/film.schema';


@Controller('films')
export class FilmsController {

    constructor(private readonly filmsService: FilmsService) {}

    @Get()
    async findAll() {
        return this.filmsService.findAll();
    }

    @Roles(Role.USER)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.filmsService.findByIdOrFail(new Types.ObjectId(id));
    }

    @Roles(Role.ADMIN)
    @Post()
    async create(@Body() film: CreateFilmDto) {
        const filmDocument = plainToInstance(Film, film);
        return this.filmsService.create(filmDocument);
    }

    @Roles(Role.ADMIN)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() film: UpdateFilmDto) {
        const filmDocument = plainToInstance(Film, film);
        return this.filmsService.updateOrFail(new Types.ObjectId(id), filmDocument);
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.filmsService.deleteOrFail(new Types.ObjectId(id));
    }
}
