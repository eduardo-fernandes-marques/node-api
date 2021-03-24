import { UsersService } from "#/services/user.service";
import { User, UserCreation } from "#/models/user.model";

export const getUser = async (userId: string): Promise<User> => {
  return UsersService.get(userId);
};

export const createUser = async (requestBody: UserCreation): Promise<void> => {
  UsersService.create(requestBody);

  return;
};
