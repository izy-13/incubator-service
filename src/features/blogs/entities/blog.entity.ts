export class BlogEntity {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export type BlogSortBy = keyof Omit<BlogEntity, 'id'>;
