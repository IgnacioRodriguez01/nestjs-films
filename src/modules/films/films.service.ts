import { Injectable } from '@nestjs/common';
import { Film } from './schema/film.schema';
import { FilmsRepository } from './repository/films.repository';
import { ConfigService } from '@nestjs/config';
import { FilterQuery, Types, UpdateQuery } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FilmsService {
    constructor(
        private readonly filmRepository: FilmsRepository,
        private readonly httpService: HttpService,
    ) {}

    async findAll(): Promise<Film[]> {
        return this.filmRepository.findAll({});
    }

    async findByIdOrFail(id: Types.ObjectId): Promise<Film> {
        return this.filmRepository.findByIdOrFail(id);
    }

    async syncFilms(): Promise<Film[]> {
        const response = await firstValueFrom(
            this.httpService.get('/films'),
          );

        const films = response.data.result;

        for (const film of films) {
            await this.filmRepository.updateOrCreate(
                { _id: film._id },
                film as unknown as Film
            );
        }

        return this.filmRepository.findAll({});
    }

    async create(film: Film): Promise<Film> {
        return this.filmRepository.create(film);
    }

    async updateOrFail(filter: FilterQuery<Film>, update: UpdateQuery<unknown>): Promise<Film> {
        return this.filmRepository.updateOrFail(filter, update);
    }

    async updateOrCreate(id: Types.ObjectId, film: Film): Promise<Film> {
        return this.filmRepository.updateOrCreate(id, film);
    }

    async deleteOrFail(id: Types.ObjectId): Promise<Film> {
        return this.filmRepository.deleteOrFail(id);
    }
}
