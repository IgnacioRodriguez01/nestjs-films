import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FilmsRepository } from './repository/films.repository';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { getModelToken } from '@nestjs/mongoose';
import { Film } from './schema/film.schema';
import { Model, Types } from 'mongoose';
import { AxiosResponse } from 'axios';

const mockFilm = {
  _id: new Types.ObjectId(),
  title: 'A New Hope',
  episode_id: 4,
  opening_crawl: 'It is a period of civil war.',
  director: 'George Lucas',
  producer: 'Gary Kurtz, Rick McCallum',
  release_date: '1977-05-25',
  characters: ['https://www.swapi.tech/api/people/1/'],
  planets: ['https://www.swapi.tech/api/planets/1/'],
  starships: ['https://www.swapi.tech/api/starships/1/'],
  vehicles: ['https://www.swapi.tech/api/vehicles/1/'],
  species: ['https://www.swapi.tech/api/species/1/'],
  created: new Date(),
  edited: new Date(),
  url: 'http://swapi.dev/api/films/1/',
};

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: FilmsRepository;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmsRepository,
          useValue: {
            findAll: jest.fn(),
            findByIdOrFail: jest.fn(),
            create: jest.fn(),
            updateOrCreate: jest.fn(),
            updateOrFail: jest.fn(),
            deleteOrFail: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
            provide: getModelToken(Film.name),
            useValue: Model,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    repository = module.get<FilmsRepository>(FilmsRepository);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of films', async () => {
      const result = [mockFilm];
      jest.spyOn(repository, 'findAll').mockResolvedValue(result as any);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findByIdOrFail', () => {
    it('should return a film', async () => {
      jest.spyOn(repository, 'findByIdOrFail').mockResolvedValue(mockFilm as any);

      expect(await service.findByIdOrFail(mockFilm._id)).toBe(mockFilm);
    });
  });

  describe('create', () => {
    it('should create a film', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(mockFilm as any);

      expect(await service.create(mockFilm as any)).toBe(mockFilm);
    });
  });

  describe('syncFilms', () => {
    it('should sync films from external API', async () => {
      const httpResponse: AxiosResponse = {
        data: { result: [mockFilm] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };
      jest.spyOn(httpService, 'get').mockReturnValue(of(httpResponse));
      jest.spyOn(repository, 'updateOrCreate').mockResolvedValue(mockFilm as any);
      jest.spyOn(repository, 'findAll').mockResolvedValue([mockFilm] as any);

      const result = await service.syncFilms();

      expect(httpService.get).toHaveBeenCalledWith('/films');
      expect(repository.updateOrCreate).toHaveBeenCalledWith(
        { _id: mockFilm._id },
        mockFilm,
      );
      expect(result).toEqual([mockFilm]);
    });
  });

  describe('updateOrFail', () => {
    it('should update a film', async () => {
      jest.spyOn(repository, 'updateOrFail').mockResolvedValue(mockFilm as any);
      const updateQuery = { title: 'New Title' };

      expect(await service.updateOrFail({ _id: mockFilm._id }, updateQuery)).toBe(mockFilm);
    });
  });

  describe('deleteOrFail', () => {
    it('should delete a film', async () => {
      jest.spyOn(repository, 'deleteOrFail').mockResolvedValue(mockFilm as any);

      expect(await service.deleteOrFail(mockFilm._id)).toBe(mockFilm);
    });
  });

});
