export type User = {
  name: string;
  email: string;
  userId: string;
  description: string;
  phoneNumbers: string;
  status?: "Happy" | "Sad";
};

export type UserCreation = Pick<User, "email" | "name" | "phoneNumbers">;
