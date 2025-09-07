import { Injectable } from '@nestjs/common';
import { Film } from './schema/film.schema';
import { FilmsRepository } from './repository/films.repository';
import { Types } from 'mongoose';

@Injectable()
export class FilmsService {
    constructor(private readonly filmRepository: FilmsRepository) {}

    async findAll(): Promise<Film[]> {
        return this.filmRepository.findAll({});
    }

    async findByIdOrFail(id: Types.ObjectId): Promise<Film> {
        return this.filmRepository.findByIdOrFail(id);
    }

    async create(film: Film): Promise<Film> {
        return this.filmRepository.create(film);
    }

    async updateOrFail(id: Types.ObjectId, film: Film): Promise<Film> {
        return this.filmRepository.updateOrFail(id, film);
    }

    async deleteOrFail(id: Types.ObjectId): Promise<Film> {
        return this.filmRepository.deleteOrFail(id);
    }
}
