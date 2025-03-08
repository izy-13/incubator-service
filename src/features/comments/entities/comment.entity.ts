export class CommentEntity {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
}

export type CommentSortBy = keyof Omit<CommentEntity, 'id'>;
