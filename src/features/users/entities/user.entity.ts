export class UserEntity {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export type UserSortBy = keyof Omit<UserEntity, 'id'>;
