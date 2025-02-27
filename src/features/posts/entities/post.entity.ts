export class PostEntity {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

export type PostSortBy = keyof Omit<PostEntity, 'id'>;
