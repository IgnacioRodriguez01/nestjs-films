import { Controller, Get, Param, Post, Body, Delete, Patch, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { FilmsService } from './films.service';
import { Types } from 'mongoose';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CreateFilmDto, UpdateFilmDto } from './dto/films.dto';
import { plainToInstance } from 'class-transformer';
import { Film } from './schema/film.schema';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ValidateMongoId } from '../../common/pipes/validate-mdb-id.pipe';

@Controller('films')
@ApiTags('Films')
export class FilmsController {
    constructor(private readonly filmsService: FilmsService) {}

    @Get()
    @ApiOkResponse({ type: [Film] })
    @ApiOperation({ summary: 'Get all films' })
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return this.filmsService.findAll();
    }

    @Roles(Role.USER)
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: Film })
    @ApiOperation({ summary: 'Get a film by id' })
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ValidateMongoId) id: string) {
        return this.filmsService.findByIdOrFail(new Types.ObjectId(id));
    }

    @Roles(Role.ADMIN)
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: Film })
    @ApiOperation({ summary: 'Create a film' })
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() film: CreateFilmDto) {
        const filmDocument = plainToInstance(Film, film);
        return this.filmsService.create(filmDocument);
    }

    @Roles(Role.ADMIN)
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: Film })
    @ApiOperation({ summary: 'Update a film by id' })
    @HttpCode(HttpStatus.OK)
    async update(@Param('id', ValidateMongoId) id: string, @Body() film: UpdateFilmDto) {
        const filmDocument = plainToInstance(Film, film);
        return this.filmsService.updateOrFail(new Types.ObjectId(id), filmDocument);
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: Film })
    @ApiOperation({ summary: 'Delete a film by id' })
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id', ValidateMongoId) id: string) {
        return this.filmsService.deleteOrFail(new Types.ObjectId(id));
    }
}
