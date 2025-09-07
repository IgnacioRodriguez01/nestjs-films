import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmSchema, Film } from './schema/film.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsRepository } from './repository/films.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }])],
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository]
})
export class FilmsModule {}
