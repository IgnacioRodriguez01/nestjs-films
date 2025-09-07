import { PartialType, PickType } from "@nestjs/mapped-types";
import { Film } from "../schema/film.schema";

const createFilmDtoProps: (keyof Film)[] = [
    'properties'
];

export class CreateFilmDto extends PickType(Film, createFilmDtoProps) {}

export class UpdateFilmDto extends PartialType(CreateFilmDto) {}
    