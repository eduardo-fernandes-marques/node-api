import fixtures from "#/config/server/fixtures.json";
import { User, UserCreation } from "#/models/user.model";

export abstract class UsersService {
  public static get(userId: string): User {
    return { ...fixtures.user, userId: userId.toString() } as User;
  }

  public static create(userCreation: UserCreation): User {
    return {
      status: "Happy",
      description: "Test",
      userId: Math.floor(Math.random() * 10000).toString(),
      ...userCreation,
    };
  }
}
