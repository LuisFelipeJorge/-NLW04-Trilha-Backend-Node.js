import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';

class SurveysController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const surveysReposiroty = getCustomRepository(SurveysRepository);

    const survey = surveysReposiroty.create ({
      title,
      description
    });

    await surveysReposiroty.save(survey);
    
    return response.status(201).json(survey);    

  }

  async show(request:Request, response:Response) {
    const surveysReposiroty = getCustomRepository(SurveysRepository);
    const all = await surveysReposiroty.find();

    return response.json(all);
  }
}

export { SurveysController };
