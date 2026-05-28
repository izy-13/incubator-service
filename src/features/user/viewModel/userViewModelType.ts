export class UserViewModelType {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export type UserSortBy = keyof Omit<UserViewModelType, 'id'>;
