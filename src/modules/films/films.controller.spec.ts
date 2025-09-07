import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Types } from 'mongoose';
import { CreateFilmDto, UpdateFilmDto } from './dto/films.dto';
import { Film } from './schema/film.schema';

const mockFilm = {
  _id: new Types.ObjectId(),
  title: 'A New Hope',
  episode_id: 4,
  opening_crawl: 'It is a period of civil war.',
  director: 'George Lucas',
  producer: 'Gary Kurtz, Rick McCallum',
  release_date: '1980-05-17',
  species: ['https://www.swapi.tech/api/species/1/'],
  starships: ['https://www.swapi.tech/api/starships/1/'],
  vehicles: ['https://www.swapi.tech/api/vehicles/1/'],
  characters: ['https://www.swapi.tech/api/people/1/'],
  planets: ['https://www.swapi.tech/api/planets/1/'],
  url: 'http://swapi.dev/api/films/2/',
  created: new Date(),
  edited: new Date(),
};

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockFilm]),
            findByIdOrFail: jest.fn().mockResolvedValue(mockFilm),
            syncFilms: jest.fn().mockResolvedValue([mockFilm]),
            create: jest.fn().mockResolvedValue(mockFilm),
            updateOrFail: jest.fn().mockResolvedValue(mockFilm),
            deleteOrFail: jest.fn().mockResolvedValue(mockFilm),
          },
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of films', async () => {
      await expect(controller.findAll()).resolves.toEqual([mockFilm]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single film', async () => {
      await expect(controller.findOne(mockFilm._id.toHexString())).resolves.toEqual(mockFilm);
      expect(service.findByIdOrFail).toHaveBeenCalledWith(mockFilm._id);
    });
  });

  describe('syncFilms', () => {
    it('should sync films and return an array of films', async () => {
      await expect(controller.syncFilms()).resolves.toEqual([mockFilm]);
      expect(service.syncFilms).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a film', async () => {
      const createFilmDto: CreateFilmDto = {
        description: 'A New Hope',
        uid: 'a_new_hope',
        properties: {
          title: 'A New Hope',
          episode_id: '4',
          opening_crawl: 'It is a period of civil war.',
          director: 'George Lucas',
          producer: 'Gary Kurtz, Rick McCallum',
          release_date: '1980-05-17',
          species: ['https://www.swapi.tech/api/species/1/'],
          starships: ['https://www.swapi.tech/api/starships/1/'],
          vehicles: ['https://www.swapi.tech/api/vehicles/1/'],
          characters: ['https://www.swapi.tech/api/people/1/'],
          planets: ['https://www.swapi.tech/api/planets/1/'],
          url: 'http://swapi.dev/api/films/2/',
          created: new Date(),
          edited: new Date(),
        },
      };
      await expect(controller.create(createFilmDto)).resolves.toEqual(mockFilm);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a film', async () => {
      const updateFilmDto: UpdateFilmDto = {
        properties: {
          title: 'The Empire Strikes Back',
          episode_id: '5',
          opening_crawl: 'It is a dark time for the Rebellion.',
          director: 'Irvin Kershner',
          producer: 'Gary Kurtz, Rick McCallum',
          release_date: '1980-05-17',
          species: ['https://www.swapi.tech/api/species/1/'],
          starships: ['https://www.swapi.tech/api/starships/1/'],
          vehicles: ['https://www.swapi.tech/api/vehicles/1/'],
          characters: ['https://www.swapi.tech/api/people/1/'],
          planets: ['https://www.swapi.tech/api/planets/1/'],
          url: 'http://swapi.dev/api/films/2/',
          created: new Date(),
          edited: new Date(),
        },
      };
      await expect(
        controller.update(mockFilm._id.toHexString(), updateFilmDto),
      ).resolves.toEqual(mockFilm);
      expect(service.updateOrFail).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a film', async () => {
      await expect(controller.delete(mockFilm._id.toHexString())).resolves.toEqual(mockFilm);
      expect(service.deleteOrFail).toHaveBeenCalledWith(mockFilm._id);
    });
  });
});
