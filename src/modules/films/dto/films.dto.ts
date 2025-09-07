import { PartialType, PickType } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested, IsString, IsDate, IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class FilmPropertiesDto {
    @IsString()
    @ApiProperty({ example: 'A New Hope' })
    title: string;
    @IsString()
    @ApiProperty({ example: '4' })
    episode_id: string;
    @IsString()
    @ApiProperty({ example: 'It is a period of civil war.\nRebel spaceships, striking\nfrom a hidden base, have won\ntheir first victory against\nthe evil Galactic Empire.' })
    opening_crawl: string;
    @IsString()
    @ApiProperty({ example: 'George Lucas' })
    director: string;
    @IsString()
    @ApiProperty({ example: 'Gary Kurtz, Rick McCallum' })
    producer: string;
    @IsString()
    @ApiProperty({ example: '1977-05-25' })
    release_date: string;
    @IsString({ each: true })
    @ApiProperty({ example: ['https://swapi.co/api/species/12/', 'https://swapi.co/api/species/24/', 'https://swapi.co/api/species/38/'] })
    species: string[];
    @IsString({ each: true })
    @ApiProperty({ example: ['https://swapi.co/api/starships/12/', 'https://swapi.co/api/starships/22/', 'https://swapi.co/api/starships/30/'] })
    starships: string[];
    @IsString({ each: true })
    @ApiProperty({ example: ['https://swapi.co/api/vehicles/44/', 'https://swapi.co/api/vehicles/46/', 'https://swapi.co/api/vehicles/48/'] })
    vehicles: string[];
    @IsString({ each: true })
    @ApiProperty({ example: ['https://swapi.co/api/people/1/', 'https://swapi.co/api/people/2/', 'https://swapi.co/api/people/3/'] })
    characters: string[];
    @IsString({ each: true })
    @ApiProperty({ example: ['https://swapi.co/api/planets/1/', 'https://swapi.co/api/planets/2/'] })
    planets: string[];
    @IsString()
    @ApiProperty({ example: 'https://swapi.co/api/films/1/' })
    url: string;
    @IsDate()
    @ApiProperty({ example: '2014-12-15T12:50:52.886000Z' })
    created: Date;
    @IsDate()
    @ApiProperty({ example: '2014-12-20T21:17:56.811000Z' })
    edited: Date;
}
  
export class FilmDto {
    @IsMongoId()
    @ApiProperty({ example: '5e74511700734000184e954a' })
    _id?: Types.ObjectId;
    
    @IsString()
    @ApiProperty({ example: 'A New Hope' })
    description?: string;
    
    @IsString()
    @ApiProperty({ example: 'a_new_hope' })
    uid: string;
  
    @Type(() => FilmPropertiesDto)
    @ValidateNested()
    @ApiProperty({ type: () => FilmPropertiesDto })
    properties: FilmPropertiesDto;
}

const createFilmProperties: (keyof FilmPropertiesDto)[] = ['title', 'episode_id', 'opening_crawl', 'director', 'producer', 'release_date', 'species', 'starships', 'vehicles', 'characters', 'planets', 'url']
export class CreateFilmPropertiesDto extends PickType(FilmPropertiesDto, createFilmProperties) {}

export class CreateFilmDto extends PickType(FilmDto, ['description', 'uid']) {
    @Type(() => CreateFilmPropertiesDto)
    @ValidateNested()
    @ApiProperty({ type: () => CreateFilmPropertiesDto })
    properties: CreateFilmPropertiesDto;
}

export class UpdateFilmDto extends PartialType(CreateFilmDto) {}
    