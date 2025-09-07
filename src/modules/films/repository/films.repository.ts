import { Injectable } from "@nestjs/common";
import { EntityRepository } from "src/common/database/entity.repository";
import { FilmDocument } from "../schema/film.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class FilmsRepository extends EntityRepository<FilmDocument> {
  constructor(
    @InjectModel('Film')
    private readonly filmModel: Model<FilmDocument>,
  ) {
    super(filmModel)
  }
}