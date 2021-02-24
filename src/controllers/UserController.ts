import { Request, Response} from 'express';
import { getRepository } from 'typeorm';
import { User } from "../models/User";

class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const usersReposiroty = getRepository(User);
    
    const userAlreadyExists = await usersReposiroty.findOne({
      email
    });

    if (userAlreadyExists) {
      return response.status(400).json({
        error: "User already exists!!",
      })
    }

    const user = usersReposiroty.create({
      name, email
    })

    await usersReposiroty.save(user);
    
    return response.json(user);    
  }
}

export { UserController };