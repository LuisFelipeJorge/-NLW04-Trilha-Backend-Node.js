import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { resolve } from 'path';

import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';
import { UserController } from './UserController';

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersReposiroty = getCustomRepository(UsersRepository);
    const surveysReposiroty = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userAlreadyExists =  await usersReposiroty.findOne({email});

    if (!userAlreadyExists) {
      return response.status(400).json({
        error: "User does not exists", 
      });
    }

    const surveyAlreadyExists = await surveysReposiroty.findOne({id: survey_id});

    if(!surveyAlreadyExists) {
      return response.status(400).json({
        error: "Survey does not exists",
      });
    }
    
    const userContent = userAlreadyExists;
    const surveyContent = surveyAlreadyExists;
    const variables = {
      name: userContent.name,
      title: surveyContent.title,
      description: surveyContent.description,
      user_id: userContent.id,
      link: process.env.URL_MAIL,
    }
    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
    
    const surveyUserAlreadyExists =   await surveysUsersRepository.findOne({
      where: [{user_id: userContent.id}, {value: null}],
      relations: ["user", "survey"],
    })
    
    if(surveyUserAlreadyExists) { 
      await SendMailService.execute(
        email, 
        surveyContent.title, 
        variables, 
        npsPath
      );
      return response.json(surveyUserAlreadyExists);
    }
    
    // Saving the info on the surveyUse table
    const surveyUser = surveysUsersRepository.create({
      user_id: userAlreadyExists.id,
      survey_id
    })
    await surveysUsersRepository.save(surveyUser);
    
    // sending the email to the user
    await SendMailService.execute(email, surveyContent.title, variables, npsPath);
    
    return response.json(surveyUser);
  }
}

export { SendMailController };
