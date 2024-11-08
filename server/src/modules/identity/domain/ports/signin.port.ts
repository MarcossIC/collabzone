import { User } from '../models/user.domain';

export abstract class SigninUsecase {
  abstract execute({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User>;
}
