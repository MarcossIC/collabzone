import { UserCreation } from '../models/usercreation.domain';

export abstract class SignupUsecase {
  abstract execute(user: UserCreation);
}
